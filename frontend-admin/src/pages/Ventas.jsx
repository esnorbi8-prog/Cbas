import { useEffect, useState } from 'react'
import api from '../services/api'

const estadoColor = {
  pendiente: { bg: '#fef3c7', color: '#d97706', label: '⏳ Pendiente' },
  pagado:    { bg: '#dcfce7', color: '#16a34a', label: '✅ Pagado' },
  despachado:{ bg: '#dbeafe', color: '#1d4ed8', label: '🚚 Despachado' },
  cancelado: { bg: '#fee2e2', color: '#dc2626', label: '❌ Cancelado' },
}

export function Ventas() {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroCanal, setFiltroCanal] = useState('')
  const [detalle, setDetalle] = useState(null)

  useEffect(() => { cargar() }, [filtroEstado, filtroCanal])

  async function cargar() {
    setCargando(true)
    try {
      const params = {}
      if (filtroEstado) params.estado = filtroEstado
      if (filtroCanal) params.canal = filtroCanal
      const { data } = await api.get('/ventas', { params })
      setVentas(data.ventas)
    } catch (err) { console.error(err) }
    finally { setCargando(false) }
  }

  async function cambiarEstado(id, estado) {
    try {
      await api.patch(`/ventas/${id}/estado`, { estado })
      cargar()
      setDetalle(null)
    } catch (err) { alert('Error al cambiar estado') }
  }

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px' }}>💰 Historial de Ventas</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' }}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="despachado">Despachado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select value={filtroCanal} onChange={e => setFiltroCanal(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' }}>
          <option value="">Todos los canales</option>
          <option value="presencial">Presencial</option>
          <option value="web">Web</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['#', 'Fecha', 'Cliente', 'Canal', 'Total', 'Pago', 'Estado', 'Ver'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Cargando...</td></tr>
            ) : ventas.map(v => {
              const est = estadoColor[v.estado] || estadoColor.pendiente
              return (
                <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#64748b', fontSize: '13px' }}>#{v.numero}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                    {new Date(v.creado_en).toLocaleDateString('es-PE')}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>
                    {v.clientes?.nombre || 'Sin nombre'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                    {v.canal === 'web' ? '🌐' : v.canal === 'whatsapp' ? '💬' : '🏪'} {v.canal}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#059669' }}>
                    S/ {parseFloat(v.total).toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                    {v.metodo_pago || '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: est.bg, color: est.color }}>
                      {est.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => setDetalle(v)} style={{
                      padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0',
                      background: '#fff', fontSize: '13px', cursor: 'pointer'
                    }}>Ver</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Detalle modal */}
      {detalle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 20px' }}>Venta #{detalle.numero}</h2>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Productos:</div>
              {detalle.venta_items?.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                  <span>{i.nombre_producto} x{i.cantidad}</span>
                  <span style={{ fontWeight: '600' }}>S/ {parseFloat(i.subtotal).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontWeight: '800', fontSize: '18px', color: '#f97316' }}>
                <span>TOTAL</span>
                <span>S/ {parseFloat(detalle.total).toFixed(2)}</span>
              </div>
            </div>
            {detalle.comprobante_url && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Comprobante Yape:</div>
                <img src={detalle.comprobante_url} alt="Comprobante" style={{ width: '100%', borderRadius: '8px' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['pagado', 'despachado', 'cancelado'].map(est => (
                <button key={est} onClick={() => cambiarEstado(detalle.id, est)} style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  background: estadoColor[est].bg, color: estadoColor[est].color
                }}>
                  Marcar {estadoColor[est].label}
                </button>
              ))}
            </div>
            <button onClick={() => setDetalle(null)} style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0',
              background: '#fff', fontSize: '14px', cursor: 'pointer'
            }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Pedidos() {
  return <Ventas />
}
