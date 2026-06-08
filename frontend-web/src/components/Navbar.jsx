import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useClienteAuth } from '../context/ClienteAuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { totalItems } = useCarrito()
  const { cliente, logout } = useClienteAuth()
  const [buscar, setBuscar] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleBuscar(e) {
    e.preventDefault()
    if (buscar.trim()) { navigate(`/productos?buscar=${buscar}`); setMenuAbierto(false) }
  }

  return (
    <>
      <nav style={{
        background: '#111', borderBottom: '2px solid #F5C100',
        padding: '0 20px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        fontFamily: "'IBM Plex Sans', sans-serif"
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '34px', height: '34px', background: '#F5C100', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔧</div>
          <div>
            <div style={{ color: '#f0f0f0', fontWeight: '600', fontSize: isMobile ? '13px' : '15px', lineHeight: 1 }}>Ferretería Nasca</div>
            {!isMobile && <div style={{ color: '#F5C100', fontSize: '9px', letterSpacing: '2px', marginTop: '2px' }}>NASCA, ICA</div>}
          </div>
        </Link>

        {/* Buscador — solo desktop */}
        {!isMobile && (
          <form onSubmit={handleBuscar} style={{ flex: 1, maxWidth: '380px', margin: '0 20px' }}>
            <div style={{ display: 'flex', background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' }}>
              <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar productos..."
                style={{ flex: 1, padding: '9px 14px', background: 'transparent', border: 'none', outline: 'none', color: '#f0f0f0', fontSize: '13px' }} />
              <button type="submit" style={{ padding: '9px 14px', background: '#F5C100', border: 'none', color: '#0a0a0a', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🔍</button>
            </div>
          </form>
        )}

        {/* Links desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/productos" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', padding: '6px 12px' }}>Productos</Link>
            {cliente ? (
              <>
                <Link to="/mis-pedidos" style={{ color: '#f0f0f0', textDecoration: 'none', fontSize: '13px', padding: '6px 12px', background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '6px' }}>
                  👤 {cliente.nombre.split(' ')[0]}
                </Link>
                <button onClick={logout} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', background: 'transparent', border: '0.5px solid #2a2a2a', color: '#666', cursor: 'pointer' }}>Salir</button>
              </>
            ) : (
              <Link to="/login" style={{ padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', background: '#F5C100', color: '#0a0a0a', textDecoration: 'none' }}>
                Iniciar sesión
              </Link>
            )}
            <Link to="/carrito" style={{ position: 'relative', textDecoration: 'none', marginLeft: '4px' }}>
              <div style={{ background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '8px', padding: '7px 12px', fontSize: '16px' }}>🛒</div>
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#F5C100', color: '#0a0a0a', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>
              )}
            </Link>
          </div>
        )}

        {/* Mobile: carrito + hamburguesa */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/carrito" style={{ position: 'relative', textDecoration: 'none' }}>
              <div style={{ background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '8px', padding: '7px 10px', fontSize: '16px' }}>🛒</div>
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#F5C100', color: '#0a0a0a', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>
              )}
            </Link>
            <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '8px', padding: '7px 10px', fontSize: '18px', cursor: 'pointer', color: '#f0f0f0' }}>
              {menuAbierto ? '✕' : '☰'}
            </button>
          </div>
        )}
      </nav>

      {/* Menú móvil desplegable */}
      {isMobile && menuAbierto && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99,
          background: '#111', borderBottom: '2px solid #F5C100',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          {/* Buscador móvil */}
          <form onSubmit={handleBuscar}>
            <div style={{ display: 'flex', background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' }}>
              <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar productos..."
                style={{ flex: 1, padding: '10px 14px', background: 'transparent', border: 'none', outline: 'none', color: '#f0f0f0', fontSize: '14px' }} />
              <button type="submit" style={{ padding: '10px 14px', background: '#F5C100', border: 'none', color: '#0a0a0a', cursor: 'pointer', fontWeight: '600' }}>🔍</button>
            </div>
          </form>

          <Link to="/productos" onClick={() => setMenuAbierto(false)} style={{ color: '#f0f0f0', textDecoration: 'none', fontSize: '15px', padding: '10px 0', borderBottom: '0.5px solid #1a1a1a' }}>
            📦 Productos
          </Link>
          {cliente ? (
            <>
              <Link to="/mis-pedidos" onClick={() => setMenuAbierto(false)} style={{ color: '#f0f0f0', textDecoration: 'none', fontSize: '15px', padding: '10px 0', borderBottom: '0.5px solid #1a1a1a' }}>
                👤 {cliente.nombre}
              </Link>
              <button onClick={() => { logout(); setMenuAbierto(false) }} style={{ background: 'transparent', border: '0.5px solid #2a2a2a', borderRadius: '8px', padding: '10px', color: '#888', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuAbierto(false)} style={{ padding: '12px', borderRadius: '8px', background: '#F5C100', color: '#0a0a0a', textDecoration: 'none', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </>
  )
}
