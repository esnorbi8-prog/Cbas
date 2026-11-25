import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategorias, getConfig, whatsappLink } from '../services/tienda'
import Icon from './Icon'
import '../tienda.css'

export default function Footer() {
  const [categorias, setCategorias] = useState([])
  const [config, setConfig] = useState(null)

  useEffect(() => {
    getCategorias().then(setCategorias)
    getConfig().then(setConfig)
  }, [])

  const telefono = config?.negocio_telefono || ''
  const anio = new Date().getFullYear()

  return (
    <footer className="fn-footer">
      {telefono && (
        <div className="fn-footer__cta">
          <div className="fn-container fn-footer__cta-inner">
            <div>
              <strong>¿No encuentras lo que buscas?</strong>
              <span>Escríbenos y te ayudamos a cotizar tu obra completa.</span>
            </div>
            <a className="fn-btn fn-btn--dark" href={whatsappLink(telefono, 'Hola, quiero cotizar materiales')} target="_blank" rel="noreferrer">
              <Icon name="chat" size={18} /> Cotizar por WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="fn-container fn-footer__cols">
        <div className="fn-footer__brand">
          <Link to="/" className="fn-logo fn-logo--light">
            <span className="fn-logo__mark"><Icon name="wrench" size={22} /></span>
            <span className="fn-logo__text">
              <strong>Ferretería Nasca</strong>
              <small>Materiales · Herramientas</small>
            </span>
          </Link>
          <p>Materiales de construcción, herramientas y todo lo que necesitas para tu obra y tu hogar, en el corazón de Nasca.</p>
        </div>

        <div>
          <h4>Categorías</h4>
          <ul>
            {categorias.slice(0, 6).map(c => (
              <li key={c.id}><Link to={`/productos?categoria_id=${c.id}`}>{c.nombre}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Mi cuenta</h4>
          <ul>
            <li><Link to="/login">Iniciar sesión</Link></li>
            <li><Link to="/mis-pedidos">Mis pedidos</Link></li>
            <li><Link to="/carrito">Mi carrito</Link></li>
            <li><Link to="/productos">Catálogo</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contacto</h4>
          <ul className="fn-footer__contact">
            <li><Icon name="pin" size={16} /> {config?.negocio_direccion || 'Jr. Lima 123, Nasca, Ica'}</li>
            {config?.negocio_horario && <li><Icon name="clock" size={16} /> {config.negocio_horario}</li>}
            {telefono && <li><Icon name="phone" size={16} /> <a href={`tel:${telefono.replace(/\s/g, '')}`}>{telefono}</a></li>}
            {telefono && <li><Icon name="chat" size={16} /> <a href={whatsappLink(telefono)} target="_blank" rel="noreferrer">WhatsApp 24/7</a></li>}
          </ul>
        </div>
      </div>

      <div className="fn-footer__bottom">
        <div className="fn-container fn-footer__bottom-inner">
          <span>© {anio} Ferretería Nasca · Nasca, Ica, Perú</span>
          <span className="fn-footer__pay">Pagos con <b>Yape</b></span>
        </div>
      </div>
    </footer>
  )
}
