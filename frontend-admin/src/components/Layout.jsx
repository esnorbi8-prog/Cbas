import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menu = [
  { to: '/',          icon: '📊', label: 'Dashboard' },
  { to: '/productos', icon: '📦', label: 'Productos' },
  { to: '/ventas',    icon: '💰', label: 'Ventas' },
  { to: '/pos',       icon: '🧾', label: 'Punto de Venta' },
  { to: '/inventario',icon: '📋', label: 'Inventario' },
  { to: '/pedidos',   icon: '🚚', label: 'Pedidos Web/WA' },
]

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>🔧</div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>Ferretería Nasca</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px' }}>Sistema Admin</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {menu.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px', marginBottom: '4px',
                textDecoration: 'none', fontSize: '14px', fontWeight: '500',
                background: isActive ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: isActive ? '#f97316' : 'rgba(255,255,255,0.65)',
                borderLeft: isActive ? '3px solid #f97316' : '3px solid transparent',
                transition: 'all 0.15s'
              })}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>
            {usuario?.rol?.toUpperCase()}
          </div>
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            {usuario?.nombre}
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '9px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
            color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer'
          }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
