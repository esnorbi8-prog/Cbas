import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { precio } from '../services/tienda'
import Icon from './Icon'

export function estadoStock(p) {
  if (p.stock_actual <= 0) return { clase: 'agotado', texto: 'Agotado' }
  if (p.stock_actual <= (p.stock_minimo ?? 5)) return { clase: 'pocas', texto: 'Últimas unidades' }
  return { clase: 'ok', texto: 'En stock' }
}

export default function ProductCard({ producto: p }) {
  const { agregar } = useCarrito()
  const [agregado, setAgregado] = useState(false)
  const stock = estadoStock(p)
  const agotado = stock.clase === 'agotado'

  function handleAgregar() {
    agregar(p)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <article className={`fn-card ${agotado ? 'is-agotado' : ''}`}>
      <Link to={`/producto/${p.id}`} className="fn-card__img">
        {stock.clase !== 'ok' && <span className={`fn-badge fn-badge--${stock.clase}`}>{stock.texto}</span>}
        {p.imagen_url
          ? <img src={p.imagen_url} alt={p.nombre} loading="lazy" />
          : <span className="fn-card__placeholder">{p.categorias?.icono || '📦'}</span>}
      </Link>
      <div className="fn-card__body">
        {p.categorias?.nombre && <span className="fn-card__cat">{p.categorias.nombre}</span>}
        <Link to={`/producto/${p.id}`} className="fn-card__name">{p.nombre}</Link>
        <div className="fn-card__meta">
          <span className="fn-card__price">{precio(p.precio_venta)}</span>
          <span className="fn-card__unit">/ {p.unidad || 'unidad'}</span>
        </div>
        <div className={`fn-card__stock fn-card__stock--${stock.clase}`}>
          <i /> {agotado ? 'Sin stock' : `${p.stock_actual} disponibles`}
        </div>
        <button className="fn-btn fn-btn--primary fn-btn--block fn-card__btn" onClick={handleAgregar} disabled={agotado}>
          {agotado ? 'Agotado' : agregado ? '✓ Agregado' : <><Icon name="cart" size={16} /> Agregar al carrito</>}
        </button>
      </div>
    </article>
  )
}
