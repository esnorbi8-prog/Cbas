const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// POST /api/clientes/register
async function register(req, res) {
  const { nombre, email, telefono, password, direccion } = req.body

  if (!nombre || !email || !telefono || !password)
    return res.status(400).json({ error: 'Nombre, email, teléfono y contraseña son requeridos' })

  try {
    const existeEmail = await prisma.clientes.findFirst({ where: { email } })
    if (existeEmail) return res.status(400).json({ error: 'El email ya está registrado' })

    const existeTel = await prisma.clientes.findFirst({ where: { telefono } })
    if (existeTel) return res.status(400).json({ error: 'El teléfono ya está registrado' })

    const hash = await bcrypt.hash(password, 10)

    const cliente = await prisma.clientes.create({
      data: { nombre, email, telefono, direccion, canal_origen: 'web', password: hash }
    })

    const token = jwt.sign(
      { id: cliente.id, nombre: cliente.nombre, email: cliente.email, tipo: 'cliente' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      cliente: { id: cliente.id, nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono }
    })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// POST /api/clientes/login
async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' })

  try {
    const cliente = await prisma.clientes.findFirst({ where: { email } })

    if (!cliente || !cliente.password)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const valido = await bcrypt.compare(password, cliente.password)
    if (!valido)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const token = jwt.sign(
      { id: cliente.id, nombre: cliente.nombre, email: cliente.email, tipo: 'cliente' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      cliente: { id: cliente.id, nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono }
    })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/clientes/me
async function me(req, res) {
  try {
    const cliente = await prisma.clientes.findUnique({
      where: { id: req.cliente.id },
      select: { id: true, nombre: true, email: true, telefono: true, direccion: true }
    })
    res.json(cliente)
  } catch (err) {
    res.status(500).json({ error: 'Error interno' })
  }
}

// GET /api/clientes/pedidos
async function misPedidos(req, res) {
  try {
    const ventas = await prisma.ventas.findMany({
      where: { cliente_id: req.cliente.id },
      include: { venta_items: true },
      orderBy: { creado_en: 'desc' }
    })
    res.json(ventas)
  } catch (err) {
    res.status(500).json({ error: 'Error interno' })
  }
}

module.exports = { register, login, me, misPedidos }
