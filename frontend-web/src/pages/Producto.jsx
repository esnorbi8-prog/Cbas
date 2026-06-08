import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCarrito } from '../context/CarritoContext'

export default function Producto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const { agregar } = useCarrito()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/productos/${id}`).then(r => setProducto(r.data)).catch(() => navigate('/productos'))
  }, [id])

  function handleAgregar() {
    agregar(producto, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  if (!producto) return (
    <div style={{ textAlign: 'center', padding: '80px', fontSize: '32px' }}>⏳</div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px', fontFamily: "'Segoe UI', sans-serif" }}>
      <button onClick={() => navigate(-1)} style={{
        background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
        fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px'
      }}>
        ← Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

        {/* Imagen */}
        <div style={{
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderRadius: '20px',
          height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '96px', border: '1px solid #e2e8f0'
        }}>
          {producto.categorias?.icono || '📦'}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: '12px', color: '#f97316', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px' }}>
            {producto.categorias?.nombre?.toUpperCase()}
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#1e293b', margin: '0 0 8px', lineHeight: 1.2 }}>
            {producto.nombre}
          </h1>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
            Código: {producto.codigo} · Unidad: {producto.unidad}
          </div>

          {producto.descripcion && (
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              {producto.descripcion}
            </p>
          )}

          <div style={{ fontSize: '36px', fontWeight: '900', color: '#f97316', marginBottom: '8px' }}>
            S/ {parseFloat(producto.precio_venta).toFixed(2)}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
              background: producto.stock_actual > 0 ? '#dcfce7' : '#fee2e2',
              color: producto.stock_actual > 0 ? '#16a34a' : '#dc2626'
            }}>
              {producto.stock_actual > 0 ? `✅ En stock (${producto.stock_actual} disponibles)` : '❌ Sin stock'}
            </span>
          </div>

          {producto.stock_actual > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Cantidad:</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    style={{ padding: '8px 16px', border: 'none', background: '#f8fafc', cursor: 'pointer', fontSize: '18px' }}>−</button>
                  <span style={{ padding: '8px 20px', fontWeight: '700', fontSize: '16px' }}>{cantidad}</span>
                  <button onClick={() => setCantidad(Math.min(producto.stock_actual, cantidad + 1))}
                    style={{ padding: '8px 16px', border: 'none', background: '#f8fafc', cursor: 'pointer', fontSize: '18px' }}>+</button>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                Subtotal: <strong style={{ color: '#1e293b' }}>S/ {(parseFloat(producto.precio_venta) * cantidad).toFixed(2)}</strong>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleAgregar} style={{
                  flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                  background: agregado ? '#10b981' : 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.3s'
                }}>
                  {agregado ? '✅ Agregado al carrito' : '🛒 Agregar al carrito'}
                </button>
              </div>
            </>
          )}

          {/* Pago Yape info */}
          <div style={{ marginTop: '24px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: '700', color: '#15803d', marginBottom: '4px', fontSize: '14px' }}>
              📱 Pago fácil con Yape
            </div>
            <div style={{ fontSize: '13px', color: '#16a34a' }}>
              Al finalizar tu compra te mostraremos el QR de Yape con el monto exacto.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
