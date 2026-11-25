import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useClienteAuth } from '../context/ClienteAuthContext'
import { getCategorias, getConfig, whatsappLink, precio } from '../services/tienda'
import Icon from './Icon'
import '../tienda.css'

export default function Navbar() {
  const { totalItems, total } = useCarrito()
  const { cliente, logout } = useClienteAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [categorias, setCategorias] = useState([])
  const [config, setConfig] = useState(null)
  const [buscar, setBuscar] = useState('')
  const [catBuscar, setCatBuscar] = useState('')
  const [catsAbierto, setCatsAbierto] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const catsRef = useRef(null)

  useEffect(() => {
    getCategorias().then(setCategorias)
    getConfig().then(setConfig)
  }, [])

  // Cerrar menús al cambiar de página
  useEffect(() => { setCatsAbierto(false); setDrawer(false) }, [location.pathname, location.search])

  // Cerrar el desplegable de categorías al hacer clic fuera
  useEffect(() => {
    function fuera(e) { if (catsRef.current && !catsRef.current.contains(e.target)) setCatsAbierto(false) }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [])

  // Evitar scroll del fondo con el menú móvil abierto
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  function handleBuscar(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (buscar.trim()) params.set('buscar', buscar.trim())
    if (catBuscar) params.set('categoria_id', catBuscar)
    navigate(`/productos${params.toString() ? `?${params}` : ''}`)
  }

  const telefono = config?.negocio_telefono || ''
  const primerNombre = cliente?.nombre?.split(' ')[0]

  return (
    <header className="fn-header">
      {/* ── Barra superior ─────────────────────────────── */}
      <div className="fn-topbar">
        <div className="fn-container fn-topbar__inner">
          <span className="fn-topbar__msg">
            <Icon name="chat" size={14} /> Pide por WhatsApp las 24 horas · Recojo en tienda
          </span>
          <div className="fn-topbar__right">
            {config?.negocio_horario && (
              <span><Icon name="clock" size={14} /> {config.negocio_horario}</span>
            )}
            {telefono && (
              <a href={`tel:${telefono.replace(/\s/g, '')}`}><Icon name="phone" size={14} /> {telefono}</a>
            )}
          </div>
        </div>
      </div>

      {/* ── Logo, buscador, cuenta y carrito ───────────── */}
      <div className="fn-mainbar">
        <div className="fn-container fn-mainbar__inner">
          <button className="fn-iconbtn fn-only-mobile" onClick={() => setDrawer(true)} aria-label="Abrir menú">
            <Icon name="menu" size={22} />
          </button>

          <Link to="/" className="fn-logo">
            <span className="fn-logo__mark"><Icon name="wrench" size={22} /></span>
            <span className="fn-logo__text">
              <strong>Ferretería Nasca</strong>
              <small>Materiales · Herramientas</small>
            </span>
          </Link>

          <form className="fn-search fn-only-desktop" onSubmit={handleBuscar}>
            <select value={catBuscar} onChange={e => setCatBuscar(e.target.value)} aria-label="Categoría">
              <option value="">Todas las categorías</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <input
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              placeholder="¿Qué estás buscando? Cemento, taladro, pintura…"
            />
            <button type="submit" aria-label="Buscar"><Icon name="search" size={20} /></button>
          </form>

          <div className="fn-actions">
            {cliente ? (
              <div className="fn-account fn-only-desktop">
                <Icon name="user" size={26} stroke={1.6} />
                <div>
                  <small>Hola, {primerNombre}</small>
                  <span>
                    <Link to="/mis-pedidos">Mis pedidos</Link>
                    <button onClick={logout}>Salir</button>
                  </span>
                </div>
              </div>
            ) : (
              <Link to="/login" className="fn-account fn-only-desktop">
                <Icon name="user" size={26} stroke={1.6} />
                <div>
                  <small>Bienvenido</small>
                  <span>Iniciar sesión</span>
                </div>
              </Link>
            )}

            <Link to="/carrito" className="fn-cart" aria-label="Carrito">
              <span className="fn-cart__icon">
                <Icon name="cart" size={26} stroke={1.6} />
                <b>{totalItems}</b>
              </span>
              <span className="fn-cart__text fn-only-desktop">
                <small>Mi carrito</small>
                <strong>{precio(total)}</strong>
              </span>
            </Link>
          </div>
        </div>

        {/* Buscador móvil */}
        <form className="fn-search fn-search--mobile fn-only-mobile" onSubmit={handleBuscar}>
          <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar productos…" />
          <button type="submit" aria-label="Buscar"><Icon name="search" size={20} /></button>
        </form>
      </div>

      {/* ── Menú de navegación ─────────────────────────── */}
      <nav className="fn-navbar fn-only-desktop">
        <div className="fn-container fn-navbar__inner">
          <div className="fn-allcats" ref={catsRef}>
            <button className="fn-allcats__btn" onClick={() => setCatsAbierto(v => !v)}>
              <Icon name="menu" size={18} /> Todas las categorías <Icon name="down" size={16} />
            </button>
            {catsAbierto && (
              <ul className="fn-allcats__menu">
                {categorias.map(c => (
                  <li key={c.id}>
                    <Link to={`/productos?categoria_id=${c.id}`}>
                      <span className="fn-catemoji">{c.icono || '📦'}</span> {c.nombre}
                      <Icon name="right" size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ul className="fn-menu">
            <li><NavLink to="/" end>Inicio</NavLink></li>
            <li><NavLink to="/productos">Catálogo</NavLink></li>
            {categorias.slice(0, 4).map(c => (
              <li key={c.id}><Link to={`/productos?categoria_id=${c.id}`}>{c.nombre}</Link></li>
            ))}
          </ul>

          {telefono && (
            <a className="fn-navbar__wa" href={whatsappLink(telefono)} target="_blank" rel="noreferrer">
              <Icon name="chat" size={16} /> Pedir por WhatsApp
            </a>
          )}
        </div>
      </nav>

      {/* ── Menú lateral móvil ─────────────────────────── */}
      <div className={`fn-drawer ${drawer ? 'is-open' : ''}`} onClick={() => setDrawer(false)}>
        <aside className="fn-drawer__panel" onClick={e => e.stopPropagation()}>
          <div className="fn-drawer__head">
            <span>Menú</span>
            <button className="fn-iconbtn" onClick={() => setDrawer(false)} aria-label="Cerrar menú">
              <Icon name="x" size={22} />
            </button>
          </div>

          {cliente ? (
            <div className="fn-drawer__user">
              <Icon name="user" size={20} /> Hola, {primerNombre}
            </div>
          ) : (
            <Link to="/login" className="fn-btn fn-btn--primary fn-btn--block">Iniciar sesión</Link>
          )}

          <ul className="fn-drawer__links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Catálogo completo</Link></li>
            <li><Link to="/carrito">Mi carrito ({totalItems})</Link></li>
            {cliente && <li><Link to="/mis-pedidos">Mis pedidos</Link></li>}
          </ul>

          <div className="fn-drawer__title">Categorías</div>
          <ul className="fn-drawer__links">
            {categorias.map(c => (
              <li key={c.id}>
                <Link to={`/productos?categoria_id=${c.id}`}>
                  <span className="fn-catemoji">{c.icono || '📦'}</span> {c.nombre}
                </Link>
              </li>
            ))}
          </ul>

          {telefono && (
            <a className="fn-btn fn-btn--wa fn-btn--block" href={whatsappLink(telefono)} target="_blank" rel="noreferrer">
              <Icon name="chat" size={18} /> Pedir por WhatsApp
            </a>
          )}
          {cliente && (
            <button className="fn-btn fn-btn--ghost fn-btn--block" onClick={() => { logout(); setDrawer(false) }}>
              <Icon name="logout" size={18} /> Cerrar sesión
            </button>
          )}
        </aside>
      </div>
    </header>
  )
}
