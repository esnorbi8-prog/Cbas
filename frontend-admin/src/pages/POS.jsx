import { useEffect, useState } from 'react'
import api from '../services/api'

export default function POS() {
  const [productos, setProductos] = useState([])
  const [buscar, setBuscar] = useState('')
  const [carrito, setCarrito] = useState([])
  const [metodo, setMetodo] = useState('efectivo')
  const [procesando, setProcesando] = useState(false)
  const [exito, setExito] = useState(null)

  useEffect(() => {
    if (buscar.length >= 2) {
      api.get('/productos', { params: { buscar, limit: 8 } })
        .then(r => setProductos(r.data.productos))
        .catch(console.error)
    } else {
      setProductos([])
    }
  }, [buscar])

  function agregar(prod) {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === prod.id)
      if (existe) return prev.map(i => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { ...prod, cantidad: 1 }]
    })
    setBuscar('')
    setProductos([])
  }

  function cambiarCantidad(id, val) {
    const num = parseInt(val)
    if (num <= 0) return eliminar(id)
    setCarrito(prev => prev.map(i => i.id === id ? { ...i, cantidad: num } : i))
  }

  function eliminar(id) {
    setCarrito(prev => prev.filter(i => i.id !== id))
  }

  const subtotal = carrito.reduce((s, i) => s + parseFloat(i.precio_venta) * i.cantidad, 0)

  async function cobrar() {
    if (carrito.length === 0) return
    setProcesando(true)
    try {
      const { data } = await api.post('/ventas', {
        items: carrito.map(i => ({ producto_id: i.id, cantidad: i.cantidad })),
        canal: 'presencial',
        metodo_pago: metodo,
        subtotal,
        total: subtotal
      })
      setExito(data)
      setCarrito([])
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar venta')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px' }}>🧾 Punto de Venta</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

        {/* Buscador */}
        <div>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              placeholder="🔍 Buscar producto por nombre o código..."
              value={buscar} onChange={e => setBuscar(e.target.value)}
              style={{
                width: '100%', padding: '14px 18px', borderRadius: '12px',
                border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none',
                boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            />
            {productos.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 10, marginTop: '4px', overflow: 'hidden'
              }}>
                {productos.map(p => (
                  <div key={p.id} onClick={() => agregar(p)} style={{
                    padding: '14px 18px', cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{p.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Stock: {p.stock_actual} {p.unidad}</div>
                    </div>
                    <div style={{ fontWeight: '800', color: '#f97316', fontSize: '16px' }}>
                      S/ {parseFloat(p.precio_venta).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items en venta */}
          {carrito.length === 0 ? (
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center',
              color: '#94a3b8', boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              Busca productos para agregarlos a la venta
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Producto', 'P. Unit.', 'Cantidad', 'Subtotal', ''].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{item.nombre}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '14px' }}>S/ {parseFloat(item.precio_venta).toFixed(2)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <input type="number" min="1" value={item.cantidad}
                          onChange={e => cambiarCantidad(item.id, e.target.value)}
                          style={{ width: '70px', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '14px' }} />
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#059669', fontSize: '14px' }}>
                        S/ {(parseFloat(item.precio_venta) * item.cantidad).toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => eliminar(item.id)} style={{
                          background: '#fee2e2', border: 'none', borderRadius: '6px',
                          padding: '6px 10px', cursor: 'pointer', color: '#dc2626', fontSize: '16px'
                        }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Panel de cobro */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', position: 'sticky', top: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 20px' }}>Resumen</h2>

          <div style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
            {carrito.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>{i.nombre} x{i.cantidad}</span>
                <span style={{ fontWeight: '600' }}>S/ {(parseFloat(i.precio_venta) * i.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>TOTAL</span>
            <span style={{ fontSize: '26px', fontWeight: '900', color: '#f97316' }}>S/ {subtotal.toFixed(2)}</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '10px' }}>MÉTODO DE PAGO</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[['efectivo', '💵 Efectivo'], ['yape', '📱 Yape'], ['transferencia', '🏦 Transferencia']].map(([val, lbl]) => (
                <button key={val} onClick={() => setMetodo(val)} style={{
                  flex: 1, padding: '10px 4px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  border: metodo === val ? '2px solid #f97316' : '2px solid #e2e8f0',
                  background: metodo === val ? '#fff7ed' : '#fff',
                  color: metodo === val ? '#f97316' : '#64748b'
                }}>{lbl}</button>
              ))}
            </div>
          </div>

          <button onClick={cobrar} disabled={carrito.length === 0 || procesando} style={{
            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
            background: carrito.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #f97316, #ea580c)',
            color: carrito.length === 0 ? '#94a3b8' : '#fff',
            fontSize: '16px', fontWeight: '800', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer'
          }}>
            {procesando ? 'Registrando...' : `💰 Cobrar S/ ${subtotal.toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* Modal éxito */}
      {exito && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '48px', textAlign: 'center', maxWidth: '360px', width: '100%' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Venta Registrada</h2>
            <p style={{ color: '#64748b', marginBottom: '8px' }}>Venta #{exito.numero}</p>
            <p style={{ fontSize: '28px', fontWeight: '900', color: '#f97316', marginBottom: '24px' }}>
              S/ {parseFloat(exito.total).toFixed(2)}
            </p>
            <button onClick={() => setExito(null)} style={{
              padding: '14px 32px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer'
            }}>
              Nueva Venta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
