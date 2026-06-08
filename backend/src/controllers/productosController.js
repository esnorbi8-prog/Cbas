const prisma = require('../lib/prisma')

// GET /api/productos
async function listar(req, res) {
  const { categoria, buscar, solo_web, solo_chatbot, page = 1, limit = 20 } = req.query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = { activo: true }
  if (categoria) where.categoria_id = parseInt(categoria)
  if (solo_web === 'true') where.visible_web = true
  if (solo_chatbot === 'true') where.visible_chatbot = true
  if (buscar) where.nombre = { contains: buscar, mode: 'insensitive' }

  try {
    const [productos, total] = await Promise.all([
      prisma.productos.findMany({
        where,
        include: { categorias: true, producto_imagenes: true },
        skip,
        take: parseInt(limit),
        orderBy: { nombre: 'asc' }
      }),
      prisma.productos.count({ where })
    ])

    res.json({ productos, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/productos/:id
async function obtener(req, res) {
  try {
    const producto = await prisma.productos.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { categorias: true, proveedores: true, producto_imagenes: true }
    })
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(producto)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// POST /api/productos
async function crear(req, res) {
  const { codigo, nombre, descripcion, categoria_id, proveedor_id,
          precio_compra, precio_venta, unidad, stock_actual, stock_minimo,
          imagen_url, visible_web, visible_chatbot } = req.body

  if (!codigo || !nombre || !precio_venta)
    return res.status(400).json({ error: 'codigo, nombre y precio_venta son requeridos' })

  try {
    const producto = await prisma.productos.create({
      data: {
        codigo, nombre, descripcion,
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        proveedor_id: proveedor_id ? parseInt(proveedor_id) : null,
        precio_compra: parseFloat(precio_compra || 0),
        precio_venta: parseFloat(precio_venta),
        unidad, imagen_url,
        stock_actual: parseInt(stock_actual || 0),
        stock_minimo: parseInt(stock_minimo || 5),
        visible_web: visible_web !== false,
        visible_chatbot: visible_chatbot !== false,
      }
    })

    // Registrar movimiento de inventario si hay stock inicial
    if (parseInt(stock_actual) > 0) {
      await prisma.inventario_movimientos.create({
        data: {
          producto_id: producto.id,
          tipo: 'entrada',
          cantidad: parseInt(stock_actual),
          stock_anterior: 0,
          stock_nuevo: parseInt(stock_actual),
          referencia: 'Stock inicial',
          usuario_id: req.usuario.id
        }
      })
    }

    res.status(201).json(producto)
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'El código ya existe' })
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// PUT /api/productos/:id
async function actualizar(req, res) {
  const { codigo, nombre, descripcion, categoria_id, proveedor_id,
          precio_compra, precio_venta, unidad, stock_minimo,
          imagen_url, visible_web, visible_chatbot, activo } = req.body

  try {
    const producto = await prisma.productos.update({
      where: { id: parseInt(req.params.id) },
      data: {
        codigo, nombre, descripcion,
        categoria_id: categoria_id ? parseInt(categoria_id) : undefined,
        proveedor_id: proveedor_id ? parseInt(proveedor_id) : undefined,
        precio_compra: precio_compra ? parseFloat(precio_compra) : undefined,
        precio_venta: precio_venta ? parseFloat(precio_venta) : undefined,
        unidad, imagen_url,
        stock_minimo: stock_minimo ? parseInt(stock_minimo) : undefined,
        visible_web, visible_chatbot, activo
      }
    })
    res.json(producto)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// DELETE /api/productos/:id (soft delete)
async function eliminar(req, res) {
  try {
    await prisma.productos.update({
      where: { id: parseInt(req.params.id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Producto desactivado' })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/productos/stock-bajo
async function stockBajo(req, res) {
  try {
    const productos = await prisma.productos.findMany({
      where: {
        activo: true,
        AND: [{ stock_actual: { lte: prisma.productos.fields.stock_minimo } }]
      },
      include: { categorias: true }
    })
    // Filtro manual porque Prisma no permite comparar dos campos directamente
    const resultado = await prisma.$queryRaw`
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = true AND p.stock_actual <= p.stock_minimo
      ORDER BY p.stock_actual ASC
    `
    res.json(resultado)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar, stockBajo }
