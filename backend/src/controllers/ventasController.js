const prisma = require('../lib/prisma')

// POST /api/ventas — Crear venta (POS o Web)
async function crear(req, res) {
  const { cliente_id, items, canal, metodo_pago, descuento = 0, notas } = req.body

  if (!items || items.length === 0)
    return res.status(400).json({ error: 'La venta debe tener al menos un producto' })

  try {
    for (const item of items) {
      const producto = await prisma.productos.findUnique({ where: { id: item.producto_id } })
      if (!producto) return res.status(404).json({ error: `Producto ${item.producto_id} no encontrado` })
      if (producto.stock_actual < item.cantidad)
        return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock_actual}` })
    }

    let subtotal = 0
    const itemsConPrecio = []
    for (const item of items) {
      const producto = await prisma.productos.findUnique({ where: { id: item.producto_id } })
      const itemSubtotal = parseFloat(producto.precio_venta) * item.cantidad
      subtotal += itemSubtotal
      itemsConPrecio.push({
        producto_id: producto.id,
        nombre_producto: producto.nombre,
        precio_unitario: parseFloat(producto.precio_venta),
        cantidad: item.cantidad,
        subtotal: itemSubtotal
      })
    }
    const total = subtotal - parseFloat(descuento)

    const venta = await prisma.ventas.create({
      data: {
        cliente_id: cliente_id || null,
        usuario_id: req.usuario?.id || null,
        canal: canal || 'presencial',
        metodo_pago,
        subtotal,
        descuento: parseFloat(descuento),
        total,
        notas,
        venta_items: { create: itemsConPrecio }
      },
      include: { venta_items: true, clientes: true }
    })

    for (const item of itemsConPrecio) {
      const producto = await prisma.productos.findUnique({ where: { id: item.producto_id } })
      await prisma.inventario_movimientos.create({
        data: {
          producto_id: item.producto_id,
          tipo: 'salida',
          cantidad: -item.cantidad,
          stock_anterior: producto.stock_actual,
          stock_nuevo: producto.stock_actual - item.cantidad,
          referencia: `Venta #${venta.numero}`,
          usuario_id: req.usuario?.id || null
        }
      })
    }

    res.status(201).json(venta)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/ventas
async function listar(req, res) {
  const { estado, canal, page = 1, limit = 20, desde, hasta } = req.query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = {}
  if (estado) where.estado = estado
  if (canal) where.canal = canal
  if (desde || hasta) {
    where.creado_en = {}
    if (desde) where.creado_en.gte = new Date(desde)
    if (hasta) where.creado_en.lte = new Date(hasta)
  }

  try {
    const [ventas, total] = await Promise.all([
      prisma.ventas.findMany({
        where,
        include: { clientes: true, usuarios: true, venta_items: { include: { productos: true } } },
        skip, take: parseInt(limit),
        orderBy: { creado_en: 'desc' }
      }),
      prisma.ventas.count({ where })
    ])
    res.json({ ventas, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/ventas/:id
async function obtener(req, res) {
  try {
    const venta = await prisma.ventas.findUnique({
      where: { id: req.params.id },
      include: { clientes: true, usuarios: true, venta_items: { include: { productos: true } } }
    })
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' })
    res.json(venta)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// PATCH /api/ventas/:id/estado
async function cambiarEstado(req, res) {
  const { estado, comprobante_url } = req.body
  const estadosValidos = ['pendiente', 'pagado', 'despachado', 'cancelado']

  if (!estadosValidos.includes(estado))
    return res.status(400).json({ error: 'Estado inválido' })

  try {
    const venta = await prisma.ventas.update({
      where: { id: req.params.id },
      data: { estado, comprobante_url: comprobante_url || undefined }
    })
    res.json(venta)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/ventas/resumen — Dashboard
async function resumen(req, res) {
  try {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    const [ventasHoy, ventasMes, totalProductos, pendientes] = await Promise.all([
      prisma.ventas.aggregate({
        where: { creado_en: { gte: hoy }, estado: { not: 'cancelado' } },
        _sum: { total: true }, _count: true
      }),
      prisma.ventas.aggregate({
        where: { creado_en: { gte: inicioMes }, estado: { not: 'cancelado' } },
        _sum: { total: true }, _count: true
      }),
      prisma.productos.count({ where: { activo: true } }),
      prisma.ventas.count({ where: { estado: 'pendiente' } })
    ])

    // Top 5 productos más vendidos este mes
    const topProductosRaw = await prisma.$queryRaw`
      SELECT p.nombre,
             SUM(vi.cantidad)::int as total_vendido,
             SUM(vi.subtotal)::float as total_ingresos
      FROM venta_items vi
      JOIN productos p ON vi.producto_id = p.id
      JOIN ventas v ON vi.venta_id = v.id
      WHERE v.creado_en >= date_trunc('month', CURRENT_DATE)
        AND v.estado != 'cancelado'
      GROUP BY p.id, p.nombre
      ORDER BY total_vendido DESC
      LIMIT 5
    `

    // Ventas por día últimos 7 días
    const ventasPorDiaRaw = await prisma.$queryRaw`
      SELECT DATE(creado_en) as fecha,
             COUNT(*)::int as cantidad,
             SUM(total)::float as total
      FROM ventas
      WHERE creado_en >= NOW() - INTERVAL '7 days'
        AND estado != 'cancelado'
      GROUP BY DATE(creado_en)
      ORDER BY fecha ASC
    `

    res.json({
      hoy: { total: ventasHoy._sum.total || 0, cantidad: ventasHoy._count },
      mes: { total: ventasMes._sum.total || 0, cantidad: ventasMes._count },
      totalProductos,
      pendientes,
      topProductos: topProductosRaw,
      ventasPorDia: ventasPorDiaRaw
    })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

module.exports = { crear, listar, obtener, cambiarEstado, resumen }
