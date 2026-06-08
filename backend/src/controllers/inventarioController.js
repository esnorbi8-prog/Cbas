const prisma = require('../lib/prisma')

// POST /api/inventario/movimiento — Entrada manual de stock
async function registrarMovimiento(req, res) {
  const { producto_id, tipo, cantidad, notas, referencia } = req.body

  if (!producto_id || !tipo || !cantidad)
    return res.status(400).json({ error: 'producto_id, tipo y cantidad son requeridos' })

  try {
    const producto = await prisma.productos.findUnique({ where: { id: parseInt(producto_id) } })
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })

    const cantidadNum = parseInt(cantidad)
    const esEntrada = tipo === 'entrada' || tipo === 'devolucion'
    const stockNuevo = esEntrada
      ? producto.stock_actual + cantidadNum
      : producto.stock_actual - cantidadNum

    if (stockNuevo < 0)
      return res.status(400).json({ error: 'Stock insuficiente para este movimiento' })

    const movimiento = await prisma.inventario_movimientos.create({
      data: {
        producto_id: parseInt(producto_id),
        tipo,
        cantidad: esEntrada ? cantidadNum : -cantidadNum,
        stock_anterior: producto.stock_actual,
        stock_nuevo: stockNuevo,
        referencia,
        notas,
        usuario_id: req.usuario.id
      }
    })

    res.status(201).json({ movimiento, stock_nuevo: stockNuevo })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/inventario/movimientos/:producto_id
async function historial(req, res) {
  try {
    const movimientos = await prisma.inventario_movimientos.findMany({
      where: { producto_id: parseInt(req.params.producto_id) },
      include: { usuarios: { select: { nombre: true } } },
      orderBy: { creado_en: 'desc' },
      take: 50
    })
    res.json(movimientos)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/inventario/stock-bajo
async function stockBajo(req, res) {
  try {
    const productos = await prisma.$queryRaw`
      SELECT p.id, p.codigo, p.nombre, p.stock_actual, p.stock_minimo,
             c.nombre as categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = true AND p.stock_actual <= p.stock_minimo
      ORDER BY p.stock_actual ASC
    `
    res.json(productos)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

module.exports = { registrarMovimiento, historial, stockBajo }
