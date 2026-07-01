import { useEffect, useState, useCallback } from 'react'
import '../index.css'
import { Link, useNavigate } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { useCarrito } from '../context/CarritoContext'
import api from '../services/api'

const HERO_BG = 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780817404/productos_de_ferreteria_herramientas_manuales_oygptj.webp'
const LOCAL_IMG = 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780816884/000eba55204a0b757a380fe92df73a10_qduaco.webp'

const SidebarMenu = ({ categorias, catActiva, setCatActiva }) => null

export default function Home() {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [catActiva, setCatActiva] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { agregar } = useCarrito()
  const navigate = useNavigate()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    Promise.all([
      api.get('/categorias'),
      api.get('/productos', { params: { solo_activos: true, limit: 12 } })
    ]).then(([cats, prods]) => {
      setCategorias(cats.data)
      setProductos(prods.data.productos)
    })
  }, [])

  function filtrarPorCategoria(id) {
    setCatActiva(id)
    api.get('/productos', { params: { categoria_id: id, solo_activos: true, limit: 12 } })
      .then(r => setProductos(r.data.productos))
  }

  function verTodosDeCategoria(id) {
    navigate(`/productos?categoria_id=${id}`)
  }

  const cardW = isMobile ? '160px' : '210px'

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* HERO */}
      <div className="anim-hero" style={{
        position: 'relative', borderBottom: '2px solid #F5C100',
        padding: isMobile ? '40px 20px' : '60px 32px',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center', justifyContent: 'space-between', gap: '32px',
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} />
        <div className='anim-hero-text' style={{ flex: 1, maxWidth: '520px', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(245,193,0,0.1)', border: '0.5px solid rgba(245,193,0,0.3)',
            color: '#F5C100', borderRadius: '20px', padding: '4px 14px',
            fontSize: '11px', letterSpacing: '1px', marginBottom: '20px'
          }} className='anim-badge'>⚡ FERRETERÍA #1 EN NASCA</div>
          <h1 style={{ fontSize: isMobile ? '30px' : '42px', fontWeight: '600', lineHeight: 1.15, marginBottom: '16px' }}>
            Todo para tu<br /><span style={{ color: '#F5C100' }}>obra y hogar</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#aaa', lineHeight: 1.7, marginBottom: '28px' }}>
            Cemento, fierro, herramientas y más.<br />Paga con Yape, recoge en tienda.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/productos')} style={{ padding: '13px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', background: '#F5C100', color: '#0a0a0a', border: 'none', cursor: 'pointer' }}>Ver catálogo →</button>
            <a href="https://wa.me/51999888777" target="_blank" rel="noreferrer" style={{ padding: '13px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', background: 'transparent', color: '#f0f0f0', border: '0.5px solid #555', cursor: 'pointer', textDecoration: 'none' }}>💬 WhatsApp</a>
          </div>
          <div style={{ display: 'flex', gap: '32px', marginTop: '28px' }}>
            {[['70+', 'Productos'], ['24/7', 'Chatbot IA'], ['Yape', 'Pago rápido']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#F5C100' }}>{n}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='hero-img-anim' style={{ position: 'relative', zIndex: 1, flexShrink: 0, width: isMobile ? '100%' : '300px', height: isMobile ? '200px' : '210px', borderRadius: '14px', overflow: 'hidden', border: '2px solid #F5C100' }}>
          <img src={LOCAL_IMG} alt="Ferretería Nasca" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', color: '#F5C100', fontWeight: '500' }}>📍 Jr. Lima 123, Nasca, Ica</div>
        </div>
      </div>

      {/* BENEFICIOS */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', background: '#111', borderBottom: '1px solid #1a1a1a' }}>
        {[['📱','Pago con Yape'],['💬','Chatbot 24/7'],['🏪','Recojo en tienda'],['📦','Stock garantizado']].map(([icon, label], i) => (
          <div key={label} style={{ padding: '14px', textAlign: 'center', borderRight: (!isMobile && i < 3) ? '1px solid #1a1a1a' : 'none', borderBottom: (isMobile && i < 2) ? '1px solid #1a1a1a' : 'none', fontSize: '12px', color: '#666' }}>
            <span style={{ marginRight: '6px' }}>{icon}</span>{label}
          </div>
        ))}
      </div>

      {/* CATEGORÍAS */}
      <div style={{ padding: isMobile ? '28px 16px 0' : '40px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '500' }}>Categorías</h2>
          {catActiva && (
            <button onClick={() => verTodosDeCategoria(catActiva)} style={{ fontSize: '12px', color: '#F5C100', background: 'none', border: 'none', cursor: 'pointer' }}>Ver todos →</button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
          {categorias.map((cat, idx) => (
            <div key={cat.id} onClick={() => filtrarPorCategoria(cat.id)} className={`anim-cat-card delay-${Math.min(idx+1,12)}`} style={{ background: catActiva === cat.id ? 'rgba(245,193,0,0.08)' : '#1a1a1a', border: `0.5px solid ${catActiva === cat.id ? 'rgba(245,193,0,0.5)' : '#2a2a2a'}`, borderRadius: '10px', padding: '14px 8px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{cat.icono || '📦'}</div>
              <div style={{ fontSize: '10px', color: catActiva === cat.id ? '#F5C100' : '#888', lineHeight: 1.3 }}>{cat.nombre}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CARRUSEL DE PRODUCTOS */}
      <div style={{ padding: isMobile ? '24px 16px 40px' : '32px 32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500' }}>Productos destacados</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/productos" style={{ fontSize: '12px', color: '#F5C100', textDecoration: 'none' }}>Ver todos →</Link>
            <button onClick={scrollPrev} className='carousel-btn' style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1a1a1a', border: '0.5px solid #2a2a2a', color: '#f0f0f0', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <button onClick={scrollNext} className='carousel-btn' style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F5C100', border: 'none', color: '#0a0a0a', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div ref={emblaRef} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {productos.map((p, pidx) => (
              <div key={p.id} className={`anim-card delay-${Math.min(pidx+1,12)}`} style={{ flex: `0 0 ${cardW}`, minWidth: 0, background: '#1a1a1a', border: '0.5px solid #2a2a2a', borderRadius: '10px', overflow: 'hidden' }}

              >
                <div style={{ background: '#111', height: isMobile ? '110px' : '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', borderBottom: '0.5px solid #2a2a2a', overflow: 'hidden' }}>
                  {p.imagen_url
                    ? <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{p.categorias?.icono || '📦'}</span>
                  }
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', lineHeight: 1.3, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>{p.unidad}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#F5C100' }}>S/ {parseFloat(p.precio_venta).toFixed(2)}</span>
                    <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '10px', background: p.stock_actual > 5 ? 'rgba(59,109,17,0.15)' : 'rgba(226,75,74,0.12)', color: p.stock_actual > 5 ? '#5a9e30' : '#E24B4A' }}>
                      {p.stock_actual > 0 ? `${p.stock_actual} disp.` : 'Sin stock'}
                    </span>
                  </div>
                  <button onClick={() => agregar(p)} disabled={p.stock_actual === 0} style={{ width: '100%', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: p.stock_actual === 0 ? 'transparent' : '#F5C100', color: p.stock_actual === 0 ? '#444' : '#0a0a0a', border: p.stock_actual === 0 ? '0.5px solid #2a2a2a' : 'none', cursor: p.stock_actual === 0 ? 'not-allowed' : 'pointer' }}>
                    {p.stock_actual === 0 ? 'Sin stock' : '+ Agregar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BANNER YAPE */}
      <div style={{ padding: isMobile ? '0 16px 32px' : '0 32px 40px' }}>
        <div className='banner-yape' style={{ background: 'rgba(245,193,0,0.06)', border: '0.5px solid rgba(245,193,0,0.2)', borderRadius: '12px', padding: isMobile ? '20px' : '24px 28px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Paga con <span style={{ color: '#F5C100' }}>Yape</span> — rápido y seguro</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Transfiere al 999888777 y envíanos la captura.</div>
          </div>
          <button onClick={() => navigate('/productos')} style={{ padding: '11px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', background: '#F5C100', color: '#0a0a0a', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  )
}
