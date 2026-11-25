import api from './api'

// Datos que usan varias partes de la tienda (header, inicio, footer).
// Se piden una sola vez y se reutilizan.
let categoriasPromise = null
let configPromise = null

export function getCategorias() {
  if (!categoriasPromise) {
    categoriasPromise = api.get('/categorias')
      .then(r => r.data || [])
      .catch(() => { categoriasPromise = null; return [] })
  }
  return categoriasPromise
}

const CONFIG_DEFECTO = {
  negocio_nombre: 'Ferretería Nasca',
  negocio_telefono: '+51999888777',
  negocio_direccion: 'Jr. Lima 123, Nasca, Ica',
  negocio_horario: 'Lun-Sáb 8am-7pm',
  yape_numero: '999888777',
}

export function getConfig() {
  if (!configPromise) {
    configPromise = api.get('/config')
      .then(r => ({ ...CONFIG_DEFECTO, ...(r.data || {}) }))
      .catch(() => { configPromise = null; return CONFIG_DEFECTO })
  }
  return configPromise
}

export function whatsappLink(telefono, texto = 'Hola, quiero hacer una consulta') {
  const numero = String(telefono || '').replace(/\D/g, '')
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

export function precio(valor) {
  return `S/ ${parseFloat(valor || 0).toFixed(2)}`
}
