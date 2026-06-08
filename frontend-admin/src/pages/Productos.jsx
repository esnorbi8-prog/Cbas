import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [subiendoImg, setSubiendoImg] = useState(false)
  const [buscar, setBuscar] = useState('')
  const [form, setForm] = useState({
    codigo: '', nombre: '', descripcion: '', categoria_id: '',
    proveedor_id: '', precio_compra: '', precio_venta: '',
    stock_actual: '', stock_minimo: 5, unidad: 'unidad',
    imagen_url: '', visible_web: true, visible_chatbot: true, activo: true
  })

  useEffect(() => {
    cargar()
    api.get('/categorias').then(r => setCategorias(r.data))
    api.get('/proveedores').then(r => setProveedores(r.data))
  }, [])

  async function cargar() {
    const { data } = await api.get('/productos', { params: { limit: 200 } })
    setProductos(data.productos)
  }

  function abrirNuevo() {
    setEditando(null)
    setForm({
      codigo: '', nombre: '', descripcion: '', categoria_id: '',
      proveedor_id: '', precio_compra: '', precio_venta: '',
      stock_actual: '', stock_minimo: 5, unidad: 'unidad',
      imagen_url: '', visible_web: true, visible_chatbot: true, activo: true
    })
    setModal(true)
  }

  function abrirEditar(p) {
    setEditando(p)
    setForm({
      codigo: p.codigo || '',
      nombre: p.nombre || '',
      descripcion: p.descripcion || '',
      categoria_id: p.categoria_id || '',
      proveedor_id: p.proveedor_id || '',
      precio_compra: p.precio_compra || '',
      precio_venta: p.precio_venta || '',
      stock_actual: p.stock_actual || 0,
      stock_minimo: p.stock_minimo || 5,
      unidad: p.unidad || 'unidad',
      imagen_url: p.imagen_url || '',
      visible_web: p.visible_web ?? true,
      visible_chatbot: p.visible_chatbot ?? true,
      activo: p.activo ?? true
    })
    setModal(true)
  }

  async function subirImagen(e) {
    const file = e.target.files[0]
    if (!file) return
    setSubiendoImg(true)
    try {
      const formData = new FormData()
      formData.append('imagen', file)
      const { data } = await api.post('/upload/producto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setForm(f => ({ ...f, imagen_url: data.url }))
    } catch (err) {
      alert('Error al subir imagen: ' + (err.response?.data?.error || err.message))
    } finally {
      setSubiendoImg(false)
    }
  }

  async function guardar() {
    try {
      const payload = {
        ...form,
        categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
        proveedor_id: form.proveedor_id ? parseInt(form.proveedor_id) : null,
        precio_compra: parseFloat(form.precio_compra) || 0,
        precio_venta: parseFloat(form.precio_venta),
        stock_actual: parseInt(form.stock_actual) || 0,
        stock_minimo: parseInt(form.stock_minimo) || 5,
      }
      if (editando) {
        await api.put(`/productos/${editando.id}`, payload)
      } else {
        await api.post('/productos', payload)
      }
      cargar()
      setModal(false)
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(buscar.toLowerCase())
  )

  const inp = (label, key, type = 'text', opts = {}) => (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>{label}</label>
      <input
        type={type} value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{
          width: '100%', padding: '9px 12px', background: '#0f172a',
          border: '1px solid #1e293b', borderRadius: '8px',
          color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
        }}
        {...opts}
      />
    </div>
  )

  return (
    <div style={{ padding: '28px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>Productos</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>{productos.length} productos en catálogo</p>
        </div>
        <button onClick={abrirNuevo} style={{
          padding: '10px 20px', background: '#F5C100', color: '#0a0a0a',
          border: 'none', borderRadius: '8px', fontSize: '13px',
          fontWeight: '600', cursor: 'pointer'
        }}>+ Nuevo producto</button>
      </div>

      {/* Buscador */}
      <input
        value={buscar} onChange={e => setBuscar(e.target.value)}
        placeholder="Buscar producto..."
        style={{
          width: '100%', maxWidth: '360px', padding: '10px 14px',
          background: '#1e293b', border: '1px solid #334155',
          borderRadius: '8px', color: '#f1f5f9', fontSize: '13px',
          outline: 'none', marginBottom: '20px', boxSizing: 'border-box'
        }}
      />

      {/* Tabla */}
      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Imagen', 'Producto', 'Precio', 'Stock', 'Web', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p, i) => (
              <tr key={p.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '10px 16px' }}>
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #334155' }} />
                  ) : (
                    <div style={{
                      width: '44px', height: '44px', background: '#0f172a', borderRadius: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', border: '1px solid #334155'
                    }}>
                      {p.categorias?.icono || '📦'}
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#f1f5f9' }}>{p.nombre}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{p.codigo} · {p.unidad}</div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#F5C100' }}>S/ {parseFloat(p.precio_venta).toFixed(2)}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Compra: S/ {parseFloat(p.precio_compra || 0).toFixed(2)}</div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                    background: p.stock_actual <= p.stock_minimo ? 'rgba(226,75,74,0.15)' : 'rgba(90,158,48,0.15)',
                    color: p.stock_actual <= p.stock_minimo ? '#E24B4A' : '#5a9e30'
                  }}>
                    {p.stock_actual} {p.unidad}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontSize: '18px' }}>{p.visible_web ? '✅' : '❌'}</span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <button onClick={() => abrirEditar(p)} style={{
                    padding: '6px 14px', background: 'transparent',
                    border: '1px solid #334155', borderRadius: '6px',
                    color: '#94a3b8', fontSize: '12px', cursor: 'pointer'
                  }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#1e293b', borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '580px', maxHeight: '90vh',
            overflowY: 'auto', border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
                {editando ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* IMAGEN */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>IMAGEN DEL PRODUCTO</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', background: '#0f172a', borderRadius: '10px',
                  border: '1px solid #334155', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                }}>
                  {form.imagen_url ? (
                    <img src={form.imagen_url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '32px' }}>📷</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'inline-block', padding: '9px 18px', background: subiendoImg ? '#334155' : '#F5C100',
                    color: subiendoImg ? '#64748b' : '#0a0a0a', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '600', cursor: subiendoImg ? 'not-allowed' : 'pointer'
                  }}>
                    {subiendoImg ? '⏳ Subiendo...' : '📁 Seleccionar imagen'}
                    <input type="file" accept="image/*" onChange={subirImagen} style={{ display: 'none' }} disabled={subiendoImg} />
                  </label>
                  {form.imagen_url && (
                    <button onClick={() => setForm(f => ({ ...f, imagen_url: '' }))} style={{
                      marginLeft: '8px', padding: '9px 14px', background: 'transparent',
                      border: '1px solid #334155', borderRadius: '8px',
                      color: '#E24B4A', fontSize: '13px', cursor: 'pointer'
                    }}>Quitar</button>
                  )}
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0' }}>JPG, PNG o WebP. Máx. 5MB.</p>
                </div>
              </div>
            </div>

            {/* Campos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div style={{ gridColumn: '1/-1' }}>{inp('NOMBRE', 'nombre')}</div>
              {inp('CÓDIGO', 'codigo')}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>UNIDAD</label>
                <select value={form.unidad} onChange={e => setForm({ ...form, unidad: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}>
                  {['unidad', 'bolsa', 'kg', 'metro', 'm2', 'm3', 'litro', 'rollo', 'varilla', 'par', 'juego'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              {inp('PRECIO COMPRA (S/)', 'precio_compra', 'number')}
              {inp('PRECIO VENTA (S/)', 'precio_venta', 'number')}
              {inp('STOCK INICIAL', 'stock_actual', 'number')}
              {inp('STOCK MÍNIMO', 'stock_minimo', 'number')}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>CATEGORÍA</label>
                <select value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}>
                  <option value="">Sin categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PROVEEDOR</label>
                <select value={form.proveedor_id} onChange={e => setForm({ ...form, proveedor_id: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}>
                  <option value="">Sin proveedor</option>
                  {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1', marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>DESCRIPCIÓN</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={2} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              {[['visible_web', 'Visible en web'], ['visible_chatbot', 'Visible en chatbot'], ['activo', 'Activo']].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#94a3b8' }}>
                  <div onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))} style={{
                    width: '36px', height: '20px', borderRadius: '10px',
                    background: form[key] ? '#F5C100' : '#334155',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                  }}>
                    <div style={{
                      position: 'absolute', top: '2px', left: form[key] ? '18px' : '2px',
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s'
                    }} />
                  </div>
                  {label}
                </label>
              ))}
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setModal(false)} style={{
                flex: 1, padding: '11px', background: 'transparent',
                border: '1px solid #334155', borderRadius: '8px',
                color: '#64748b', fontSize: '13px', cursor: 'pointer'
              }}>Cancelar</button>
              <button onClick={guardar} style={{
                flex: 2, padding: '11px', background: '#F5C100',
                border: 'none', borderRadius: '8px',
                color: '#0a0a0a', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
              }}>
                {editando ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
