const jwt = require('jsonwebtoken')

function clienteAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.tipo !== 'cliente')
      return res.status(403).json({ error: 'Acceso no autorizado' })
    req.cliente = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = { clienteAuthMiddleware }
