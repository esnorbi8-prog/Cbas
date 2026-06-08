import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useClienteAuth } from '../context/ClienteAuthContext'

export default function LoginCliente() {
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', confirmar: '', direccion: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login, register } = useClienteAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirigir = location.state?.from || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (modo === 'register' && form.password !== form.confirmar)
      return setError('Las contraseñas no coinciden')
    setCargando(true)
    try {
      if (modo === 'login') await login(form.email, form.password)
      else await register(form.nombre, form.email, form.telefono, form.password, form.direccion)
      navigate(redirigir)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la solicitud')
    } finally {
      setCargando(false)
    }
  }

  const inp = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>
      <input
        type={type} value={form[key]} placeholder={placeholder}
        onChange={e => setForm({ ...form, [key]: e.target.value })} required
        style={{
          width: '100%', padding: '11px 14px', background: '#1a1a1a',
          border: '0.5px solid #2a2a2a', borderRadius: '8px',
          color: '#f0f0f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
        }}
      />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'IBM Plex Sans', sans-serif", padding: '24px'
    }}>
      <div style={{
        background: '#111', border: '0.5px solid #2a2a2a',
        borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px', background: '#F5C100', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 12px'
          }}>🔧</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0f0f0' }}>Ferretería Nasca</div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
            {modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: '#1a1a1a',
          border: '0.5px solid #2a2a2a', borderRadius: '8px',
          padding: '3px', marginBottom: '24px'
        }}>
          {[['login', 'Iniciar sesión'], ['register', 'Registrarse']].map(([val, lbl]) => (
            <button key={val} onClick={() => { setModo(val); setError('') }} style={{
              flex: 1, padding: '9px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: modo === val ? '#F5C100' : 'transparent',
              color: modo === val ? '#0a0a0a' : '#555',
              fontWeight: modo === val ? '600' : '400',
              fontSize: '13px', transition: 'all 0.15s'
            }}>{lbl}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {modo === 'register' && inp('NOMBRE COMPLETO', 'nombre', 'text', 'Juan Pérez')}
          {inp('EMAIL', 'email', 'email', 'correo@ejemplo.com')}
          {modo === 'register' && inp('TELÉFONO / WHATSAPP', 'telefono', 'tel', '999888777')}
          {modo === 'register' && inp('DIRECCIÓN (opcional)', 'direccion', 'text', 'Jr. Lima 123, Nasca')}
          {inp('CONTRASEÑA', 'password', 'password', '••••••••')}
          {modo === 'register' && inp('CONFIRMAR CONTRASEÑA', 'confirmar', 'password', '••••••••')}

          {error && (
            <div style={{
              background: 'rgba(226,75,74,0.1)', border: '0.5px solid rgba(226,75,74,0.3)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
              color: '#E24B4A', fontSize: '13px'
            }}>{error}</div>
          )}

          <button type="submit" disabled={cargando} style={{
            width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
            background: cargando ? '#555' : '#F5C100',
            color: '#0a0a0a', fontSize: '14px', fontWeight: '600',
            cursor: cargando ? 'not-allowed' : 'pointer', marginTop: '4px'
          }}>
            {cargando ? 'Procesando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
