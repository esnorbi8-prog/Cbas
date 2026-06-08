const prisma = require('../lib/prisma')

// ── CATEGORÍAS ──────────────────────────────────────────────

async function listarCategorias(req, res) {
  try {
    const categorias = await prisma.categorias.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' }
    })
    res.json(categorias)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function crearCategoria(req, res) {
  const { nombre, descripcion, icono } = req.body
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' })
  try {
    const cat = await prisma.categorias.create({ data: { nombre, descripcion, icono } })
    res.status(201).json(cat)
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'Categoría ya existe' })
    res.status(500).json({ error: err.message })
  }
}

// ── PROVEEDORES ──────────────────────────────────────────────

async function listarProveedores(req, res) {
  try {
    const proveedores = await prisma.proveedores.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    })
    res.json(proveedores)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function crearProveedor(req, res) {
  const { nombre, contacto, telefono, email, direccion } = req.body
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' })
  try {
    const prov = await prisma.proveedores.create({ data: { nombre, contacto, telefono, email, direccion } })
    res.status(201).json(prov)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function actualizarProveedor(req, res) {
  const { nombre, contacto, telefono, email, direccion, activo } = req.body
  try {
    const prov = await prisma.proveedores.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, contacto, telefono, email, direccion, activo }
    })
    res.json(prov)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ── CONFIGURACIÓN ──────────────────────────────────────────────

async function obtenerConfig(req, res) {
  try {
    const config = await prisma.configuracion.findMany()
    const resultado = {}
    config.forEach(c => { resultado[c.clave] = c.valor })
    res.json(resultado)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function actualizarConfig(req, res) {
  const { clave, valor } = req.body
  try {
    const config = await prisma.configuracion.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor }
    })
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  listarCategorias, crearCategoria,
  listarProveedores, crearProveedor, actualizarProveedor,
  obtenerConfig, actualizarConfig
}
