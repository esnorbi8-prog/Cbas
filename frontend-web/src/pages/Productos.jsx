import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import api from '../services/api'

const SidebarMenu = ({ categorias, catActiva, setCatActiva, setSidebarAbierto }) => (
  <div style={{ padding: '20px 16px' }}>
    <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1.5px', marginBottom: '12px' }}>CATEGORÍAS</div>
    {[{ id: null, nombre: 'Todos', icono: '🏪' }, ...categorias].map(cat => (
      <div key={cat.id ?? 'all'} onClick={() => { setCatActiva(cat.id); setSidebarAbierto && setSidebarAbierto(false) }} style={{
        padding: '9px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
        background: catActiva === cat.id ? 'rgba(245,193,0,0.1)' : 'transparent',
        color: catActiva === cat.id ? '#F5C100' : '#888',
        border: catActiva === cat.id ? '0.5px solid rgba(245,193,0,0.3)' : '0.5px solid transparent',
        marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <span>{cat.icono || '📦'}</span> {cat.nombre}
      </div>
    ))}
  </div>
)

export default function Productos() {
  const [searchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [catActiva, setCatActiva] = useState(
    searchParams.get('categoria_id') ? parseInt(searchParams.get('categoria_id')) : null
  )
  const [busqueda, setBusqueda] = useState(searchParams.get('buscar') || '')
  const [cargando, setCargando] = useState(true)
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { agregar } = useCarrito()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    api.get('/categorias').then(r => setCategorias(r.data))
  }, [])

  useEffect(() => {
    setCargando(true)
    api.get('/productos', {
      params: {
        buscar: busqueda || undefined,
        categoria_id: catActiva || undefined,
        solo_activos: true,
        limit: 60
      }
    }).then(r => { setProductos(r.data.productos); setCargando(false) })
      .catch(() => setCargando(false))
  }, [busqueda, catActiva])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'IBM Plex Sans', sans-serif", display: 'flex' }}>

      {/* Sidebar desktop */}
      {!isMobile && (
        <div style={{ width: '210px', flexShrink: 0, background: '#111', borderRight: '1px solid #1a1a1a', position: 'sticky', top: '60px', height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
          <SidebarMenu categorias={categorias} catActiva={catActiva} setCatActiva={setCatActiva} />
        </div>
      )}

      {/* Sidebar móvil overlay */}
      {isMobile && sidebarAbierto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setSidebarAbierto(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '240px', background: '#111', borderRight: '1px solid #2a2a2a', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Categorías</span>
              <button onClick={() => setSidebarAbierto(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <SidebarMenu categorias={categorias} catActiva={catActiva} setCatActiva={setCatActiva} setSidebarAbierto={setSidebarAbierto} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, padding: isMobile ? '20px 16px' : '28px 28px' }}>

        {/* Buscador + filtro móvil */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar productos..."
            style={{ flex: 1, padding: '10px 14px', background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '8px', color: '#f0f0f0', fontSize: '13px', outline: 'none' }} />
          {isMobile && (
            <button onClick={() => setSidebarAbierto(true)} style={{ padding: '10px 14px', background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '8px', color: '#F5C100', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              ☰ Filtrar
            </button>
          )}
          <div style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {cargando ? '...' : `${productos.length} productos`}
          </div>
        </div>

        {/* Categoría activa badge */}
        {catActiva && (
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Filtrando por:</span>
            <span style={{ padding: '4px 12px', background: 'rgba(245,193,0,0.1)', border: '0.5px solid rgba(245,193,0,0.3)', borderRadius: '20px', fontSize: '12px', color: '#F5C100' }}>
              {categorias.find(c => c.id === catActiva)?.nombre}
            </span>
            <button onClick={() => setCatActiva(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px' }}>✕</button>
          </div>
        )}

        {/* Grid */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#555', fontSize: '32px' }}>⏳</div>
        ) : productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#555' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p>No encontramos productos con ese criterio.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {productos.map(p => (
              <div key={p.id} style={{ background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '10px', overflow: 'hidden' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#F5C100'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{ background: '#111', height: isMobile ? '100px' : '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', borderBottom: '0.5px solid #2a2a2a', overflow: 'hidden' }}>
                  {p.imagen_url
                    ? <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{p.categorias?.icono || '📦'}</span>
                  }
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', lineHeight: 1.3, marginBottom: '3px' }}>{p.nombre}</div>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>{p.unidad}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#F5C100' }}>S/ {parseFloat(p.precio_venta).toFixed(2)}</span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '10px', background: p.stock_actual > 5 ? 'rgba(59,109,17,0.15)' : 'rgba(226,75,74,0.12)', color: p.stock_actual > 5 ? '#5a9e30' : '#E24B4A' }}>
                      {p.stock_actual > 0 ? `${p.stock_actual} disp.` : 'Sin stock'}
                    </span>
                  </div>
                  <button onClick={() => agregar(p)} disabled={p.stock_actual === 0} style={{
                    width: '100%', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                    background: p.stock_actual === 0 ? 'transparent' : '#F5C100',
                    color: p.stock_actual === 0 ? '#444' : '#0a0a0a',
                    border: p.stock_actual === 0 ? '0.5px solid #2a2a2a' : 'none',
                    cursor: p.stock_actual === 0 ? 'not-allowed' : 'pointer'
                  }}>
                    {p.stock_actual === 0 ? 'Sin stock' : '+ Agregar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
