import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import api from '../services/api'
import { getCategorias, getConfig, whatsappLink, precio } from '../services/tienda'
import ProductCard, { estadoStock } from '../components/ProductCard'
import Icon from '../components/Icon'
import '../tienda.css'

const HERO_BG = 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780817404/productos_de_ferreteria_herramientas_manuales_oygptj.webp'
const LOCAL_IMG = 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780816884/000eba55204a0b757a380fe92df73a10_qduaco.webp'

const BENEFICIOS = [
  { icon: 'phoneApp', titulo: 'Paga con Yape', texto: 'Rápido, seguro y sin efectivo' },
  { icon: 'chat', titulo: 'Atención 24/7', texto: 'Cotiza por WhatsApp a toda hora' },
  { icon: 'store', titulo: 'Recojo en tienda', texto: 'Separa online y recoge en Nasca' },
  { icon: 'box', titulo: 'Stock en tiempo real', texto: 'Lo que ves es lo que hay' },
]

// Elige la imagen de un producto de la categoría (la primera que tenga foto)
function imagenDe(lista) {
  return lista.find(p => p.imagen_url)?.imagen_url
}
function precioMinimo(lista) {
  const precios = lista.map(p => parseFloat(p.precio_venta)).filter(n => n > 0)
  return precios.length ? Math.min(...precios) : null
}

export default function Home() {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [config, setConfig] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [tab, setTab] = useState('todos')

  useEffect(() => {
    getCategorias().then(setCategorias)
    getConfig().then(setConfig)
    api.get('/productos', { params: { solo_activos: true, solo_web: true, limit: 200 } })
      .then(r => setProductos(r.data.productos || []))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false))
  }, [])

  // ── Datos derivados ───────────────────────────────────────
  const porCategoria = useMemo(() => {
    const mapa = {}
    productos.forEach(p => { (mapa[p.categoria_id] ||= []).push(p) })
    return mapa
  }, [productos])

  const catsConProductos = useMemo(() =>
    categorias
      .map(c => ({ ...c, productos: porCategoria[c.id] || [] }))
      .filter(c => c.productos.length > 0)
      .sort((a, b) => b.productos.length - a.productos.length),
  [categorias, porCategoria])

  const buscarCat = (texto) =>
    catsConProductos.find(c => c.nombre.toLowerCase().includes(texto)) || null

  const destacadaHero = buscarCat('eléctric') || catsConProductos[0]
  const banners = [buscarCat('pintura'), buscarCat('plomer'), ...catsConProductos]
    .filter(Boolean)
    .filter((c, i, arr) => c.id !== destacadaHero?.id && arr.findIndex(x => x.id === c.id) === i)
    .slice(0, 2)

  const tabs = catsConProductos.slice(0, 5)
  const listaTab = useMemo(() => {
    const base = tab === 'todos' ? productos : (porCategoria[tab] || [])
    // Primero los que tienen foto y stock
    return [...base]
      .sort((a, b) => (!!b.imagen_url - !!a.imagen_url) || ((b.stock_actual > 0) - (a.stock_actual > 0)))
      .slice(0, 10)
  }, [tab, productos, porCategoria])

  const enStock = productos.filter(p => p.stock_actual > 0)
  const nuevos = [...productos].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en)).slice(0, 4)
  const economicos = [...enStock].sort((a, b) => a.precio_venta - b.precio_venta).slice(0, 4)
  const ultimas = enStock.filter(p => estadoStock(p).clase === 'pocas').slice(0, 4)

  const telefono = config?.negocio_telefono || ''
  const direccion = config?.negocio_direccion || 'Jr. Lima 123, Nasca, Ica'

  // ── Slider principal ─────────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [slide, setSlide] = useState(0)
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSlide(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    const timer = setInterval(() => emblaApi.scrollNext(), 6000)
    return () => { clearInterval(timer); emblaApi.off('select', onSelect) }
  }, [emblaApi])

  const slides = [
    { key: 'principal' },
    destacadaHero && { key: 'categoria', cat: destacadaHero },
    { key: 'whatsapp' },
  ].filter(Boolean)

  return (
    <main className="fn-home">
      {/* ── HERO: categorías + slider + banners ────────── */}
      <section className="fn-container fn-hero">
        <aside className="fn-hero__cats">
          <div className="fn-hero__cats-title"><Icon name="grid" size={16} /> Categorías</div>
          <ul>
            {categorias.map(c => (
              <li key={c.id}>
                <Link to={`/productos?categoria_id=${c.id}`}>
                  <span className="fn-catemoji">{c.icono || '📦'}</span>
                  <span>{c.nombre}</span>
                  <Icon name="right" size={14} />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/productos" className="fn-hero__cats-all">Ver todo el catálogo <Icon name="arrow" size={14} /></Link>
        </aside>

        <div className="fn-slider">
          <div className="fn-slider__viewport" ref={emblaRef}>
            <div className="fn-slider__track">
              {slides.map(s => (
                <div className="fn-slide" key={s.key}>
                  {s.key === 'principal' && (
                    <div className="fn-slide__inner fn-slide--dark" style={{ backgroundImage: `url(${HERO_BG})` }}>
                      <div className="fn-slide__content">
                        <span className="fn-eyebrow">Ferretería en Nasca, Ica</span>
                        <h1>Todo para tu <em>obra</em> y tu <em>hogar</em></h1>
                        <p>Cemento, fierro, herramientas, pintura y más. Compra online, paga con Yape y recoge en tienda.</p>
                        <div className="fn-slide__ctas">
                          <button className="fn-btn fn-btn--primary fn-btn--lg" onClick={() => navigate('/productos')}>
                            Ver catálogo <Icon name="arrow" size={18} />
                          </button>
                          {telefono && (
                            <a className="fn-btn fn-btn--outline-light fn-btn--lg" href={whatsappLink(telefono)} target="_blank" rel="noreferrer">
                              <Icon name="chat" size={18} /> Cotizar por WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {s.key === 'categoria' && (
                    <div className="fn-slide__inner fn-slide--light">
                      <div className="fn-slide__content">
                        <span className="fn-eyebrow fn-eyebrow--dark">Destacado del mes</span>
                        <h2>{s.cat.nombre}</h2>
                        <p>{s.cat.productos.length} productos disponibles para tu próximo trabajo.</p>
                        {precioMinimo(s.cat.productos) && (
                          <div className="fn-slide__price">Desde <strong>{precio(precioMinimo(s.cat.productos))}</strong></div>
                        )}
                        <button className="fn-btn fn-btn--dark fn-btn--lg" onClick={() => navigate(`/productos?categoria_id=${s.cat.id}`)}>
                          Comprar ahora <Icon name="arrow" size={18} />
                        </button>
                      </div>
                      {imagenDe(s.cat.productos) && <img className="fn-slide__product" src={imagenDe(s.cat.productos)} alt={s.cat.nombre} />}
                    </div>
                  )}

                  {s.key === 'whatsapp' && (
                    <div className="fn-slide__inner fn-slide--dark" style={{ backgroundImage: `url(${LOCAL_IMG})` }}>
                      <div className="fn-slide__content">
                        <span className="fn-eyebrow">Nuevo · Asistente virtual</span>
                        <h2>Cotiza al instante con <em>Ferri</em></h2>
                        <p>Nuestro asistente de WhatsApp te dice precios y stock en segundos, las 24 horas.</p>
                        {telefono && (
                          <a className="fn-btn fn-btn--wa fn-btn--lg" href={whatsappLink(telefono, 'Hola Ferri, quiero cotizar')} target="_blank" rel="noreferrer">
                            <Icon name="chat" size={18} /> Escribir a Ferri
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button className="fn-slider__arrow fn-slider__arrow--prev" onClick={prev} aria-label="Anterior"><Icon name="left" size={20} /></button>
          <button className="fn-slider__arrow fn-slider__arrow--next" onClick={next} aria-label="Siguiente"><Icon name="right" size={20} /></button>
          <div className="fn-slider__dots">
            {slides.map((s, i) => (
              <button key={s.key} className={i === slide ? 'is-active' : ''} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Ir al slide ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="fn-hero__banners">
          {banners.map((c, i) => (
            <Link key={c.id} to={`/productos?categoria_id=${c.id}`} className={`fn-promo fn-promo--${i === 0 ? 'yellow' : 'gray'}`}>
              <div>
                <span className="fn-promo__tag">{c.productos.length} productos</span>
                <h3>{c.nombre}</h3>
                {precioMinimo(c.productos) && <p>Desde <strong>{precio(precioMinimo(c.productos))}</strong></p>}
                <span className="fn-promo__link">Ver más <Icon name="arrow" size={14} /></span>
              </div>
              {imagenDe(c.productos) && <img src={imagenDe(c.productos)} alt={c.nombre} />}
            </Link>
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS ─────────────────────────────────── */}
      <section className="fn-container">
        <div className="fn-features">
          {BENEFICIOS.map(b => (
            <div className="fn-feature" key={b.titulo}>
              <span className="fn-feature__icon"><Icon name={b.icon} size={26} stroke={1.7} /></span>
              <div>
                <strong>{b.titulo}</strong>
                <span>{b.texto}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS CON PESTAÑAS ──────────── */}
      <section className="fn-container fn-section">
        <div className="fn-section__head">
          <h2 className="fn-title">Productos destacados</h2>
          <div className="fn-tabs">
            <button className={tab === 'todos' ? 'is-active' : ''} onClick={() => setTab('todos')}>Todos</button>
            {tabs.map(c => (
              <button key={c.id} className={tab === c.id ? 'is-active' : ''} onClick={() => setTab(c.id)}>{c.nombre}</button>
            ))}
          </div>
        </div>

        {cargando ? (
          <div className="fn-grid">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="fn-card fn-card--skeleton" />)}
          </div>
        ) : listaTab.length === 0 ? (
          <p className="fn-empty">Aún no hay productos para mostrar.</p>
        ) : (
          <div className="fn-grid">
            {listaTab.map(p => <ProductCard key={p.id} producto={p} />)}
          </div>
        )}

        <div className="fn-section__more">
          <Link to={tab === 'todos' ? '/productos' : `/productos?categoria_id=${tab}`} className="fn-btn fn-btn--outline">
            Ver todos los productos <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>

      {/* ── BANNERS YAPE + CHATBOT ─────────────────────── */}
      <section className="fn-container fn-duo">
        <div className="fn-duo__item fn-duo__item--yape">
          <span className="fn-eyebrow fn-eyebrow--dark">Pago fácil</span>
          <h3>Paga con Yape en segundos</h3>
          <p>Yapea al <strong>{config?.yape_numero || '999888777'}</strong>, sube tu captura y listo. Te confirmamos el pedido al momento.</p>
          <Link to="/productos" className="fn-btn fn-btn--dark">Empezar a comprar <Icon name="arrow" size={16} /></Link>
          <Icon name="phoneApp" size={150} stroke={1} className="fn-duo__bg" />
        </div>
        <div className="fn-duo__item fn-duo__item--dark">
          <span className="fn-eyebrow">Recojo en tienda</span>
          <h3>Compra online, recoge en Nasca</h3>
          <p>Separa tus materiales desde casa y pásalos a recoger sin hacer cola en {direccion}.</p>
          <a className="fn-btn fn-btn--primary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`} target="_blank" rel="noreferrer">
            Cómo llegar <Icon name="pin" size={16} />
          </a>
          <Icon name="store" size={150} stroke={1} className="fn-duo__bg" />
        </div>
      </section>

      {/* ── CATEGORÍAS POPULARES ───────────────────────── */}
      {catsConProductos.length > 0 && (
        <section className="fn-container fn-section">
          <div className="fn-section__head">
            <h2 className="fn-title">Compra por categoría</h2>
            <Link to="/productos" className="fn-link">Ver catálogo completo <Icon name="arrow" size={14} /></Link>
          </div>
          <div className="fn-catgrid">
            {catsConProductos.slice(0, 8).map(c => (
              <div className="fn-cattile" key={c.id}>
                <Link to={`/productos?categoria_id=${c.id}`} className="fn-cattile__img">
                  {imagenDe(c.productos)
                    ? <img src={imagenDe(c.productos)} alt={c.nombre} loading="lazy" />
                    : <span className="fn-card__placeholder">{c.icono || '📦'}</span>}
                </Link>
                <div className="fn-cattile__body">
                  <Link to={`/productos?categoria_id=${c.id}`} className="fn-cattile__name">{c.nombre}</Link>
                  <span className="fn-cattile__count">{c.productos.length} productos</span>
                  <ul>
                    {c.productos.slice(0, 3).map(p => (
                      <li key={p.id}><Link to={`/producto/${p.id}`}>{p.nombre}</Link></li>
                    ))}
                  </ul>
                  <Link to={`/productos?categoria_id=${c.id}`} className="fn-link fn-link--sm">Ver todo <Icon name="arrow" size={12} /></Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LISTAS RÁPIDAS ─────────────────────────────── */}
      {productos.length > 0 && (
        <section className="fn-container fn-section">
          <div className="fn-lists">
            {[
              { titulo: 'Lo más nuevo', lista: nuevos },
              { titulo: 'Mejores precios', lista: economicos },
              { titulo: 'Últimas unidades', lista: ultimas },
            ].filter(l => l.lista.length > 0).map(l => (
              <div className="fn-list" key={l.titulo}>
                <h3 className="fn-list__title">{l.titulo}</h3>
                {l.lista.map(p => (
                  <Link to={`/producto/${p.id}`} className="fn-mini" key={p.id}>
                    <span className="fn-mini__img">
                      {p.imagen_url ? <img src={p.imagen_url} alt="" loading="lazy" /> : (p.categorias?.icono || '📦')}
                    </span>
                    <span className="fn-mini__info">
                      <span className="fn-mini__name">{p.nombre}</span>
                      <span className="fn-mini__price">{precio(p.precio_venta)} <small>/ {p.unidad || 'unidad'}</small></span>
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── VISÍTANOS ──────────────────────────────────── */}
      <section className="fn-container fn-section">
        <div className="fn-visit">
          <div className="fn-visit__img" style={{ backgroundImage: `url(${LOCAL_IMG})` }} />
          <div className="fn-visit__body">
            <span className="fn-eyebrow fn-eyebrow--dark">Nuestra tienda</span>
            <h2>Visítanos en Nasca</h2>
            <p>Más de 10 categorías de materiales y herramientas, con asesoría para que compres justo lo que tu obra necesita.</p>
            <ul className="fn-visit__data">
              <li><Icon name="pin" size={18} /> {direccion}</li>
              {config?.negocio_horario && <li><Icon name="clock" size={18} /> {config.negocio_horario}</li>}
              {telefono && <li><Icon name="phone" size={18} /> {telefono}</li>}
            </ul>
            <div className="fn-slide__ctas">
              <a className="fn-btn fn-btn--dark" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`} target="_blank" rel="noreferrer">
                <Icon name="pin" size={16} /> Cómo llegar
              </a>
              {telefono && (
                <a className="fn-btn fn-btn--wa" href={whatsappLink(telefono)} target="_blank" rel="noreferrer">
                  <Icon name="chat" size={16} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
