require('dotenv').config()
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const Anthropic = require('@anthropic-ai/sdk')
const axios = require('axios')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const API = process.env.BACKEND_URL || 'http://localhost:3001/api'
const ADMIN_PHONE = process.env.ADMIN_PHONE || '51999888777'
const YAPE_NUMERO = process.env.YAPE_NUMERO || '999888777'
const YAPE_NOMBRE = process.env.YAPE_NOMBRE || 'Ferretería Nasca'
const YAPE_QR_URL = process.env.YAPE_QR_URL || 'https://i.imgur.com/dIOlG6n.jpeg'

const conversaciones = new Map()

async function obtenerTodosProductos() {
  try {
    const { data } = await axios.get(`${API}/productos`, { params: { solo_chatbot: true, limit: 100 } })
    return data.productos || []
  } catch (err) {
    return []
  }
}

async function obtenerCategorias() {
  try {
    const { data } = await axios.get(`${API}/categorias`)
    return data || []
  } catch (err) {
    return []
  }
}

function crearSystemPrompt(todosProductos, categorias) {
  const listaProductos = todosProductos.length > 0
    ? todosProductos.map(p => `- ${p.nombre} | Precio: S/ ${parseFloat(p.precio_venta).toFixed(2)} | Stock: ${p.stock_actual} ${p.unidad}`).join('\n')
    : 'No hay productos disponibles.'

  return `Eres "Ferri", el asistente virtual de Ferreteria Nasca, ubicada en Nasca, Ica, Peru.
Eres amable, directo y hablas en espanol peruano informal.

INFORMACION DEL NEGOCIO:
- Nombre: Ferreteria Nasca
- Ubicacion: Jr. Lima 123, Nasca, Ica, Peru
- Horario: Lunes a Sabado 8am - 7pm
- Pago: Solo Yape (numero: ${YAPE_NUMERO}, a nombre de: ${YAPE_NOMBRE})

CATEGORIAS DISPONIBLES:
${categorias.map(c => `- ${c.nombre}`).join('\n')}

LISTA COMPLETA DE PRODUCTOS EN STOCK (SOLO ESTOS EXISTEN, NO INVENTES OTROS):
${listaProductos}

INSTRUCCIONES IMPORTANTES:
1. SOLO puedes ofrecer productos que aparecen en la lista de arriba. NUNCA inventes productos, marcas ni precios.
2. Si el cliente pregunta por un producto que NO esta en la lista, dile claramente que no lo tenemos.
3. Cuando el cliente quiera comprar, pregunta la cantidad y calcula el total.
4. Para el pago usa SIEMPRE Yape: numero ${YAPE_NUMERO}, a nombre de ${YAPE_NOMBRE}.
5. Cuando confirmes un pedido con el total y datos de pago, agrega la palabra PEDIDO_CONFIRMADO al final (oculta, sin mostrarsela al cliente).
6. Se breve y directo. No escribas respuestas muy largas.
7. Si piden hablar con una persona real, indica que llamen al ${ADMIN_PHONE}.

FORMATO PARA CONFIRMAR PEDIDO:
Resumen de tu pedido:
- [producto] x[cantidad] = S/ [subtotal]
Total: S/ [total]

Paga por Yape:
Numero: ${YAPE_NUMERO}
A nombre de: ${YAPE_NOMBRE}
Monto exacto: S/ [total]

Te envio el QR de Yape ahora mismo. Realiza la transferencia y envianos la captura del pago. Un asesor lo confirmara pronto!
PEDIDO_CONFIRMADO`
}

async function procesarConClaude(telefono, mensaje) {
  if (!conversaciones.has(telefono)) {
    conversaciones.set(telefono, [])
  }
  const historial = conversaciones.get(telefono)
  historial.push({ role: 'user', content: mensaje })
  if (historial.length > 20) historial.splice(0, historial.length - 20)

  try {
    const [todosProductos, categorias] = await Promise.all([
      obtenerTodosProductos(),
      obtenerCategorias()
    ])

    const systemPrompt = crearSystemPrompt(todosProductos, categorias)

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: historial
    })

    let respuesta = response.content[0].text
    const pedidoConfirmado = respuesta.includes('PEDIDO_CONFIRMADO')
    respuesta = respuesta.replace('PEDIDO_CONFIRMADO', '').trim()

    historial.push({ role: 'assistant', content: respuesta })
    return { respuesta, pedidoConfirmado }
  } catch (err) {
    console.error('Error con Claude:', err.message)
    return {
      respuesta: `Disculpa, tuve un problema tecnico. Por favor escribenos directamente al ${ADMIN_PHONE}`,
      pedidoConfirmado: false
    }
  }
}

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'ferreteria-nasca' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
})

client.on('qr', (qr) => {
  console.log('\nEscanea este QR con WhatsApp:\n')
  qrcode.generate(qr, { small: true })
  console.log('\nAbre WhatsApp -> Menu -> Dispositivos vinculados -> Vincular dispositivo\n')
})

client.on('ready', () => {
  console.log('Bot de WhatsApp conectado!')
  console.log('Ferri esta listo para atender clientes')
  console.log('Numero admin: ' + ADMIN_PHONE)
})

client.on('auth_failure', (msg) => {
  console.error('Error de autenticacion:', msg)
})

client.on('disconnected', (reason) => {
  console.log('Bot desconectado:', reason)
})

client.on('message', async (msg) => {
  console.log('>> MENSAJE DE:', msg.from, '| BODY:', msg.body)
  // Ignorar todo excepto mensajes directos reales
  if (msg.from.includes('@g.us')) return      // grupos
  if (msg.from.includes('@newsletter')) return // newsletters
  if (msg.from === 'status@broadcast') return  // estados
  if (msg.fromMe) return                       // mensajes propios

  const telefono = msg.from.replace('@c.us', '').replace('@lid', '')
  const texto = msg.body?.trim()
  if (!texto) return

  console.log('\n[' + telefono + ']: ' + texto)

  try {
    const { respuesta, pedidoConfirmado } = await procesarConClaude(telefono, texto)
    console.log('Ferri: ' + respuesta.substring(0, 100) + '...')

    // Enviar respuesta de texto
    await msg.reply(respuesta)

    // Si hay pedido confirmado, enviar QR de Yape
    if (pedidoConfirmado) {
      try {
        const media = await MessageMedia.fromUrl(YAPE_QR_URL, { unsafeMime: true })
        await client.sendMessage(msg.from, media, { caption: 'QR de Yape - Ferreteria Nasca' })
        console.log('QR de Yape enviado a ' + telefono)
      } catch (e) {
        console.error('Error enviando QR:', e.message)
      }

      // Notificar al admin
      try {
        const adminJid = ADMIN_PHONE + '@c.us'
        await client.sendMessage(adminJid, 'NUEVO PEDIDO WhatsApp\nCliente: +' + telefono + '\n\n' + respuesta)
        console.log('Admin notificado')
      } catch (e) {
        console.error('Error notificando admin:', e.message)
      }
    }
  } catch (err) {
    console.error('Error procesando mensaje:', err.message)
    try {
      await msg.reply('Disculpa, tuve un problema. Por favor intenta de nuevo.')
    } catch (e) {}
  }
})

console.log('Iniciando chatbot Ferreteria Nasca...')
console.log('Backend: ' + API)
console.log('QR Yape: ' + YAPE_QR_URL)
console.log('Iniciando WhatsApp Web...\n')

client.initialize()
