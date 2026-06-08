import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useClienteAuth } from '../context/ClienteAuthContext'

const estados = {
  pendiente:  { color: '#EF9F27', bg: 'rgba(239,159,39,0.1)', label: '⏳ Pendiente' },
  pagado:     { color: '#5a9e30', bg: 'rgba(90,158,48,0.1)',  label: '✅ Pagado' },
  despachado: { color: '#378ADD', bg: 'rgba(55,138,221,0.1)', label: '🚚 Despachado' },
  cancelado:  { color: '#E24B4A', bg: 'rgba(226,75,74,0.1)',  label: '❌ Cancelado' },
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const { cliente } = useClienteAuth()

  useEffect(() => {
    const token = localStorage.getItem('cliente_token')
    api.get('/clientes/pedidos', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setPedidos(r.data))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '6px' }}>📦 Mis Pedidos</h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '28px' }}>Hola {cliente?.nombre}, aquí están tus pedidos.</p>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '60px', fontSize: '32px' }}>⏳</div>
        ) : pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ marginBottom: '20px' }}>Aún no tienes pedidos.</p>
            <Link to="/productos" style={{
              padding: '12px 28px', background: '#F5C100', color: '#0a0a0a',
              borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px'
            }}>Ver productos</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pedidos.map(p => {
              const est = estados[p.estado] || estados.pendiente
              return (
                <div key={p.id} style={{
                  background: '#1a1a1a', border: '0.5px solid #2a2a2a',
                  borderRadius: '12px', padding: '20px 24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '15px' }}>Pedido #{p.numero}</div>
                      <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                        {new Date(p.creado_en).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                        background: est.bg, color: est.color
                      }}>{est.label}</span>
                      <span style={{ fontSize: '20px', fontWeight: '600', color: '#F5C100' }}>
                        S/ {parseFloat(p.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: '0.5px solid #222', paddingTop: '12px' }}>
                    {p.venta_items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '3px' }}>
                        <span>{item.nombre_producto} x{item.cantidad}</span>
                        <span>S/ {parseFloat(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {p.estado === 'pendiente' && (
                    <div style={{ marginTop: '12px', background: 'rgba(239,159,39,0.08)', border: '0.5px solid rgba(239,159,39,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#EF9F27' }}>
                      ⏳ Esperando verificación de pago. Si ya pagaste, escríbenos por WhatsApp.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
