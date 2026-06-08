const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ferreteria-nasca',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'limit', quality: 'auto' }]
  }
})

const upload = multer({ storage: storage })

async function subirImagen(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen' })
    console.log('Imagen subida:', req.file.path)
    res.json({ url: req.file.path, public_id: req.file.filename })
  } catch (err) {
    console.error('Error uploadController:', err)
    res.status(500).json({ error: 'Error al subir imagen', detalle: err.message })
  }
}

module.exports = { upload, subirImagen }
