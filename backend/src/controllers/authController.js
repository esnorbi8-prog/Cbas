const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email y password requeridos' })

  try {
    const usuario = await prisma.usuarios.findUnique({ where: { email } })

    if (!usuario || !usuario.activo)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    })
  } catch (err) {
    console.error('ERROR LOGIN:', err)
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// POST /api/auth/register (solo admin puede crear usuarios)
async function register(req, res) {
  const { nombre, email, password, rol } = req.body

  if (!nombre || !email || !password || !rol)
    return res.status(400).json({ error: 'Todos los campos son requeridos' })

  if (!['admin', 'vendedor', 'almacenero'].includes(rol))
    return res.status(400).json({ error: 'Rol inválido' })

  try {
    const existe = await prisma.usuarios.findUnique({ where: { email } })
    if (existe) return res.status(400).json({ error: 'Email ya registrado' })

    const hash = await bcrypt.hash(password, 10)
    const usuario = await prisma.usuarios.create({
      data: { nombre, email, password: hash, rol }
    })

    res.status(201).json({
      id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol
    })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/auth/me
async function me(req, res) {
  res.json(req.usuario)
}

module.exports = { login, register, me }
