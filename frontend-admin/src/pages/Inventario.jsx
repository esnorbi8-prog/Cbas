import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Inventario() {
  const [stockBajo, setStockBajo] = useState([])
  const [productos, setProductos] = useState([])
  const [buscar, setBuscar] = useState('')
  const [modal, setModal] = useState(false)
  const [productoSel, setProductoSel] = useState(null)
  const [historial, setHistorial] = useState([])
  const [form, setForm] = useState({ tipo: 'entrada', cantidad: 1, notas: '' })

  useEffect(() => {
    api.get('/inventario/stock-bajo').then(r => setStockBajo(r.data)).catch(console.error)
    cargarProductos()
  }, [buscar])

  async function cargarProductos() {
    const params = buscar ? { buscar } : {}
    const { data } = await api.get('/productos', { params })
    setProductos(data.productos)
  }

  async function abrirModal(prod) {
    setProductoSel(prod)
    setModal(true)
    const { data } = await api.get(`/inventario/movimientos/${prod.id}`)
    setHistorial(data)
  }

  async function registrar() {
    try {
      await api.post('/inventario/movimiento', { producto_id: productoSel.id, ...form })
      setModal(false)
      cargarProductos()
      api.get('/inventario/stock-bajo').then(r => setStockBajo(r.data))
    } catch (err) {
      alert(err.response?.data?.error || 'Error')
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px' }}>📋 Inventario</h1>

      {/* Alertas stock bajo */}
      {stockBajo.length > 0 && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>
            ⚠️ {stockBajo.length} producto(s) con stock bajo
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {stockBajo.map(p => (
              <span key={p.id} style={{ background: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#92400e', border: '1px solid #f59e0b' }}>
                {p.nombre}: {p.stock_actual} (mín. {p.stock_minimo})
              </span>
            ))}
          </div>
        </div>
      )}

      <input placeholder="🔍 Buscar producto..." value={buscar} onChange={e => setBuscar(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' }} />

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Código', 'Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Estado', 'Movimiento'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => {
              const bajo = p.stock_actual <= p.stock_minimo
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#64748b' }}>{p.codigo}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{p.nombre}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{p.categorias?.nombre || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: bajo ? '#dc2626' : '#059669' }}>
                      {p.stock_actual}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>{p.unidad}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#64748b' }}>{p.stock_minimo}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: bajo ? '#fee2e2' : '#dcfce7', color: bajo ? '#dc2626' : '#16a34a' }}>
                      {bajo ? '⚠️ Bajo' : '✅ OK'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => abrirModal(p)} style={{
                      padding: '7px 14px', borderRadius: '8px', border: '1px solid #f97316',
                      background: '#fff7ed', color: '#f97316', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                    }}>
                      + Movimiento
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal movimiento */}
      {modal && productoSel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px' }}>Registrar Movimiento</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>{productoSel.nombre} — Stock actual: <strong>{productoSel.stock_actual}</strong></p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>TIPO</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['entrada', '📥 Entrada'], ['ajuste', '🔧 Ajuste'], ['devolucion', '↩️ Devolución']].map(([val, lbl]) => (
                  <button key={val} onClick={() => setForm({ ...form, tipo: val })} style={{
                    flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    border: form.tipo === val ? '2px solid #f97316' : '2px solid #e2e8f0',
                    background: form.tipo === val ? '#fff7ed' : '#fff',
                    color: form.tipo === val ? '#f97316' : '#64748b'
                  }}>{lbl}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>CANTIDAD</label>
              <input type="number" min="1" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '8px' }}>NOTAS (opcional)</label>
              <input value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Ej: Compra a proveedor, ajuste por conteo..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            {/* Historial */}
            {historial.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '10px' }}>HISTORIAL RECIENTE</div>
                {historial.slice(0, 5).map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>{new Date(m.creado_en).toLocaleDateString('es-PE')} · {m.tipo}</span>
                    <span style={{ fontWeight: '600', color: m.cantidad > 0 ? '#059669' : '#dc2626' }}>
                      {m.cantidad > 0 ? '+' : ''}{m.cantidad} → {m.stock_nuevo}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={registrar} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
