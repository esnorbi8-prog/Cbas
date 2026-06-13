import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useClienteAuth } from '../context/ClienteAuthContext'
import api from '../services/api'

const YAPE_NUMERO = '999888777'
const YAPE_NOMBRE = 'Ferretería Nasca'
const YAPE_QR_URL = 'https://i.imgur.com/dIOlG6n.jpeg'

const S = { background: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'IBM Plex Sans', sans-serif" }
const card = { background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '12px' }

export function Carrito() {
  const { items, quitar, cambiarCantidad, total } = useCarrito()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div style={{ ...S, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
      <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>Tu carrito está vacío</h2>
      <p style={{ color: '#555', marginBottom: '24px', fontSize: '14px' }}>Agrega productos del catálogo</p>
      <Link to="/productos" style={{
        padding: '12px 28px', background: '#F5C100', color: '#0a0a0a',
        borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px'
      }}>Ver productos</Link>
    </div>
  )

  return (
    <div style={S}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '28px' }}>🛒 Tu carrito</h1>

        <div style={{ ...card, overflow: 'hidden', marginBottom: '20px' }}>
          {items.map((item, i) => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px',
              borderBottom: i < items.length - 1 ? '0.5px solid #222' : 'none'
            }}>
              <div style={{
                width: '56px', height: '56px', background: '#111', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0
              }}>
                {item.categorias?.icono || '📦'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '3px' }}>{item.nombre}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>S/ {parseFloat(item.precio_venta).toFixed(2)} c/u</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} style={{ padding: '7px 12px', border: 'none', background: '#111', color: '#f0f0f0', cursor: 'pointer', fontSize: '16px' }}>−</button>
                <span style={{ padding: '7px 14px', fontWeight: '600', fontSize: '14px' }}>{item.cantidad}</span>
                <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} style={{ padding: '7px 12px', border: 'none', background: '#111', color: '#f0f0f0', cursor: 'pointer', fontSize: '16px' }}>+</button>
              </div>
              <div style={{ fontWeight: '600', color: '#F5C100', fontSize: '16px', minWidth: '80px', textAlign: 'right' }}>
                S/ {(parseFloat(item.precio_venta) * item.cantidad).toFixed(2)}
              </div>
              <button onClick={() => quitar(item.id)} style={{
                background: 'rgba(226,75,74,0.1)', border: '0.5px solid rgba(226,75,74,0.2)',
                borderRadius: '6px', padding: '7px 10px', cursor: 'pointer', color: '#E24B4A', fontSize: '14px'
              }}>✕</button>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>Total a pagar</span>
            <span style={{ fontSize: '26px', fontWeight: '600', color: '#F5C100' }}>S/ {total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/productos')} style={{
            flex: 1, padding: '13px', borderRadius: '8px',
            border: '0.5px solid #2a2a2a', background: 'transparent',
            color: '#888', fontSize: '14px', cursor: 'pointer'
          }}>← Seguir comprando</button>
          <button onClick={() => navigate('/checkout')} style={{
            flex: 2, padding: '13px', borderRadius: '8px', border: 'none',
            background: '#F5C100', color: '#0a0a0a', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer'
          }}>Pagar con Yape 📱</button>
        </div>
      </div>
    </div>
  )
}

export function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const { cliente } = useClienteAuth()
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [comprobante, setComprobante] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [venta, setVenta] = useState(null)

  if (items.length === 0 && paso !== 4) { navigate('/carrito'); return null }

  async function confirmarPedido() {
    setEnviando(true)
    try {
      const token = localStorage.getItem('cliente_token')
      const { data } = await api.post('/ventas', {
        cliente_id: cliente?.id || null,
        items: items.map(i => ({ producto_id: i.id, cantidad: i.cantidad })),
        canal: 'web', metodo_pago: 'yape', subtotal: total, total,
        notas: `Cliente: ${cliente?.nombre} | Tel: ${cliente?.telefono}`
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      setVenta(data); setPaso(2)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear el pedido')
    } finally { setEnviando(false) }
  }

  async function enviarComprobante() {
    if (!comprobante || !venta) return
    setEnviando(true)
    try {
      // 1. Subir imagen a Cloudinary
      const formData = new FormData()
      formData.append('comprobante', comprobante)
      const { data: imgData } = await api.post('/upload/comprobante', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // 2. Guardar URL real en la venta
      await api.patch(`/ventas/${venta.id}/estado`, {
        estado: 'pendiente',
        comprobante_url: imgData.url
      })
      vaciar(); setPaso(4)
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    } finally { setEnviando(false) }
  }

  const wrapStyle = { ...S, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px' }
  const boxStyle = { ...card, padding: '36px', width: '100%', maxWidth: '500px' }

  return (
    <div style={wrapStyle}>
      <div style={boxStyle}>

        {paso === 1 && (
          <>
            <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '20px' }}>📋 Confirmar pedido</h1>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>
              Hola <strong style={{ color: '#f0f0f0' }}>{cliente?.nombre}</strong>, revisa tu pedido antes de pagar.
            </p>
            <div style={{ background: '#111', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              {items.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#888' }}>{i.nombre} x{i.cantidad}</span>
                  <span style={{ color: '#F5C100' }}>S/ {(parseFloat(i.precio_venta) * i.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: '0.5px solid #222', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                <span>TOTAL</span>
                <span style={{ color: '#F5C100', fontSize: '18px' }}>S/ {total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={confirmarPedido} disabled={enviando} style={{
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
              background: enviando ? '#555' : '#F5C100', color: '#0a0a0a',
              fontSize: '15px', fontWeight: '600', cursor: enviando ? 'not-allowed' : 'pointer'
            }}>
              {enviando ? 'Procesando...' : 'Confirmar y ver QR Yape →'}
            </button>
          </>
        )}

        {paso === 2 && (
          <>
            <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px', textAlign: 'center' }}>📱 Paga con Yape</h1>
            <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', marginBottom: '24px' }}>Escanea el QR o transfiere al número indicado</p>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ border: '2px solid #F5C100', borderRadius: '12px', padding: '16px', display: 'inline-block', background: '#111' }}>
                <img src={YAPE_QR_URL} alt="QR Yape" style={{ width: '180px', height: '180px', borderRadius: '8px', display: 'block' }} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#F5C100', margin: '12px 0 4px' }}>S/ {total.toFixed(2)}</div>
              <div style={{ fontSize: '12px', color: '#555' }}>Monto exacto a transferir</div>
            </div>
            <div style={{ background: '#111', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              {[['Número', `📱 ${YAPE_NUMERO}`], ['A nombre de', YAPE_NOMBRE], ['Monto', `S/ ${total.toFixed(2)}`]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '0.5px solid #1a1a1a' }}>
                  <span style={{ color: '#555' }}>{k}</span>
                  <span style={{ color: '#f0f0f0', fontWeight: '500' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPaso(3)} style={{
              width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
              background: '#F5C100', color: '#0a0a0a', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}>
              Ya pagué, subir comprobante →
            </button>
          </>
        )}

        {paso === 3 && (
          <>
            <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>📸 Enviar comprobante</h1>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '24px' }}>Sube la captura de pantalla de tu pago por Yape</p>
            <div
              onClick={() => document.getElementById('file-input').click()}
              style={{
                border: `2px dashed ${comprobante ? '#F5C100' : '#2a2a2a'}`,
                borderRadius: '12px', padding: '40px', textAlign: 'center',
                marginBottom: '20px', background: '#111', cursor: 'pointer'
              }}
            >
              {comprobante ? (
                <>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontWeight: '500', color: '#F5C100', marginBottom: '4px' }}>Imagen seleccionada</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{comprobante.name}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '40px', marginBottom: '8px', color: '#555' }}>📷</div>
                  <div style={{ fontSize: '14px', color: '#555' }}>Toca para subir captura</div>
                </>
              )}
              <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setComprobante(e.target.files[0])} />
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '20px', background: '#111', borderRadius: '8px', padding: '12px' }}>
              💬 También puedes enviarlo por WhatsApp al <strong style={{ color: '#F5C100' }}>{YAPE_NUMERO}</strong>
            </div>
            <button onClick={enviarComprobante} disabled={!comprobante || enviando} style={{
              width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
              background: !comprobante ? '#1a1a1a' : '#F5C100',
              color: !comprobante ? '#444' : '#0a0a0a', fontSize: '14px', fontWeight: '600',
              cursor: !comprobante ? 'not-allowed' : 'pointer',
              border: !comprobante ? '0.5px solid #2a2a2a' : 'none'
            }}>
              {enviando ? 'Enviando...' : '✅ Confirmar pedido'}
            </button>
          </>
        )}

        {paso === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>¡Pedido registrado!</h1>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>
              Verificaremos tu pago y te contactaremos para coordinar el recojo.
            </p>
            <div style={{ background: '#111', borderRadius: '8px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#F5C100', fontWeight: '500', marginBottom: '8px' }}>¿Qué sigue?</div>
              {['Verificamos tu pago (máx. 30 min en horario laboral)', 'Te contactamos al WhatsApp que registraste', 'Coordinas el recojo en tienda'].map((s, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  <span style={{ color: '#F5C100', marginRight: '8px' }}>{i + 1}.</span>{s}
                </div>
              ))}
            </div>
            <Link to="/mis-pedidos" style={{
              display: 'block', padding: '13px', borderRadius: '8px', background: '#F5C100',
              color: '#0a0a0a', textDecoration: 'none', fontWeight: '600', fontSize: '14px', marginBottom: '10px'
            }}>Ver mis pedidos</Link>
            <button onClick={() => navigate('/')} style={{
              width: '100%', padding: '13px', borderRadius: '8px',
              border: '0.5px solid #2a2a2a', background: 'transparent',
              color: '#888', fontSize: '14px', cursor: 'pointer'
            }}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  )
}
