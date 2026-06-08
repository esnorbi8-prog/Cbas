const express = require('express')
const router = express.Router()
const { authMiddleware, soloAdmin } = require('../middlewares/auth')
const { clienteAuthMiddleware } = require('../middlewares/clienteAuth')

const authCtrl = require('../controllers/authController')
const productosCtrl = require('../controllers/productosController')
const ventasCtrl = require('../controllers/ventasController')
const inventarioCtrl = require('../controllers/inventarioController')
const catalogoCtrl = require('../controllers/catalogoController')
const clienteCtrl = require('../controllers/clienteController')
const { upload, subirImagen } = require('../controllers/uploadController')

// ── AUTH STAFF ────────────────────────────────────────────────
router.post('/auth/login', authCtrl.login)
router.post('/auth/register', authMiddleware, soloAdmin, authCtrl.register)
router.get('/auth/me', authMiddleware, authCtrl.me)

// ── AUTH CLIENTES (web) ───────────────────────────────────────
router.post('/clientes/register', clienteCtrl.register)
router.post('/clientes/login', clienteCtrl.login)
router.get('/clientes/me', clienteAuthMiddleware, clienteCtrl.me)
router.get('/clientes/pedidos', clienteAuthMiddleware, clienteCtrl.misPedidos)

// ── PRODUCTOS (públicos para web/chatbot) ─────────────────────
router.get('/productos', productosCtrl.listar)
router.get('/productos/stock-bajo', authMiddleware, productosCtrl.stockBajo)
router.get('/productos/:id', productosCtrl.obtener)
router.post('/productos', authMiddleware, productosCtrl.crear)
router.put('/productos/:id', authMiddleware, productosCtrl.actualizar)
router.delete('/productos/:id', authMiddleware, soloAdmin, productosCtrl.eliminar)

// ── VENTAS ────────────────────────────────────────────────────
router.get('/ventas/resumen', authMiddleware, ventasCtrl.resumen)
router.get('/ventas', authMiddleware, ventasCtrl.listar)
router.get('/ventas/:id', authMiddleware, ventasCtrl.obtener)
router.post('/ventas', ventasCtrl.crear)
router.patch('/ventas/:id/estado', ventasCtrl.cambiarEstado)  // sin auth para web

// ── INVENTARIO ────────────────────────────────────────────────
router.post('/inventario/movimiento', authMiddleware, inventarioCtrl.registrarMovimiento)
router.get('/inventario/movimientos/:producto_id', authMiddleware, inventarioCtrl.historial)
router.get('/inventario/stock-bajo', authMiddleware, inventarioCtrl.stockBajo)

// ── CATEGORÍAS ────────────────────────────────────────────────
router.get('/categorias', catalogoCtrl.listarCategorias)
router.post('/categorias', authMiddleware, soloAdmin, catalogoCtrl.crearCategoria)
// ── UPLOAD IMÁGENES ───────────────────────────────────────────
router.post('/upload/producto', authMiddleware, upload.single('imagen'), subirImagen)

// ── PROVEEDORES ───────────────────────────────────────────────
router.get('/proveedores', authMiddleware, catalogoCtrl.listarProveedores)
router.post('/proveedores', authMiddleware, soloAdmin, catalogoCtrl.crearProveedor)
router.put('/proveedores/:id', authMiddleware, soloAdmin, catalogoCtrl.actualizarProveedor)

// ── CONFIGURACIÓN ─────────────────────────────────────────────
router.get('/config', catalogoCtrl.obtenerConfig)
router.put('/config', authMiddleware, soloAdmin, catalogoCtrl.actualizarConfig)

module.exports = router
