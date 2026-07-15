import { useState } from 'react'
import api from '../services/api'


const REPORTES = [
  {
    id: 'ventas',
    icon: '💰',
    titulo: 'Reporte de Ventas',
    descripcion: 'Resumen de ventas, detalle de items y estadísticas por canal y estado.',
    hojas: ['Resumen de Ventas', 'Detalle de Items', 'Estadísticas'],
    filtros: true,
    color: '1F3864',
  },
  {
    id: 'inventario',
    icon: '📦',
    titulo: 'Reporte de Inventario',
    descripcion: 'Stock actual, alertas de productos bajos y historial de movimientos.',
    hojas: ['Stock Actual', 'Alertas de Stock', 'Historial Movimientos'],
    filtros: false,
    color: '0F6E56',
  },
  {
    id: 'productos',
    icon: '🏷️',
    titulo: 'Reporte de Productos',
    descripcion: 'Catálogo completo con precios, márgenes y resumen por categoría.',
    hojas: ['Catálogo Completo', 'Por Categoría'],
    filtros: false,
    color: '4B3BA8',
  },
]

export default function Reportes() {
  const [descargando, setDescargando] = useState({})
  const [filtros, setFiltros] = useState({ desde: '', hasta: '', estado: '', canal: '' })
  const [mensaje, setMensaje] = useState(null)

  async function descargar(tipo) {
    setDescargando(d => ({ ...d, [tipo]: true }))
    setMensaje(null)
    try {
      const params = {}
      if (tipo === 'ventas') {
        if (filtros.desde)  params.desde  = filtros.desde
        if (filtros.hasta)  params.hasta  = filtros.hasta
        if (filtros.estado) params.estado = filtros.estado
        if (filtros.canal)  params.canal  = filtros.canal
      }

      const resp = await api.get(`/reportes/${tipo}`, {
        params,
        responseType: 'blob'
      })

      const blob = new Blob([resp.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Reporte_${tipo.charAt(0).toUpperCase() + tipo.slice(1)}_${new Date().toISOString().slice(0,10)}.xlsx`
      link.click()
      URL.revokeObjectURL(link.href)

      setMensaje({ tipo: 'ok', texto: `✅ Reporte de ${tipo} descargado correctamente` })
    } catch (err) {
      setMensaje({ tipo: 'error', texto: `❌ Error: ${err.response?.data?.error || err.message}` })
    } finally {
      setDescargando(d => ({ ...d, [tipo]: false }))
    }
  }

  const inp = (label, key, type='text', opts={}) => (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {opts.select ? (
        <select value={filtros[key]} onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))}
          style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }}>
          <option value="">Todos</option>
          {opts.opciones.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : (
        <input type={type} value={filtros[key]} onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))}
          style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', color: '#f1f5f9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
      )}
    </div>
  )

  return (
    <div style={{ padding: '28px', fontFamily: "'IBM Plex Sans', sans-serif", background: '#0f172a', minHeight: '100vh', color: '#f1f5f9' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: 0, color: '#f1f5f9' }}>
          📊 Reportes Excel
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '6px 0 0' }}>
          Genera y descarga reportes del sistema en formato Excel (.xlsx)
        </p>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
          background: mensaje.tipo === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${mensaje.tipo === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: mensaje.tipo === 'ok' ? '#4ade80' : '#f87171', fontSize: '13px'
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Filtros de ventas */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '12px', color: '#F5C100', fontWeight: '600', letterSpacing: '1px', marginBottom: '14px' }}>
          FILTROS PARA REPORTE DE VENTAS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {inp('DESDE', 'desde', 'date')}
          {inp('HASTA', 'hasta', 'date')}
          {inp('ESTADO', 'estado', 'text', { select: true, opciones: [
            { v: 'pendiente', l: 'Pendiente' },
            { v: 'pagado', l: 'Pagado' },
            { v: 'despachado', l: 'Despachado' },
            { v: 'cancelado', l: 'Cancelado' },
          ]})}
          {inp('CANAL', 'canal', 'text', { select: true, opciones: [
            { v: 'web', l: 'Web' },
            { v: 'whatsapp', l: 'WhatsApp' },
            { v: 'presencial', l: 'Presencial' },
          ]})}
        </div>
        <p style={{ fontSize: '11px', color: '#475569', margin: '10px 0 0' }}>
          💡 Deja los filtros vacíos para descargar todas las ventas
        </p>
      </div>

      {/* Cards de reportes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {REPORTES.map(r => (
          <div key={r.id} style={{
            background: '#1e293b', borderRadius: '12px',
            border: '1px solid #334155', overflow: 'hidden'
          }}>
            {/* Header de la card */}
            <div style={{ background: `#${r.color}22`, borderBottom: '1px solid #334155', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '28px' }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9' }}>{r.titulo}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Formato: Excel (.xlsx)</div>
              </div>
            </div>

            {/* Cuerpo */}
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>
                {r.descripcion}
              </p>

              {/* Hojas incluidas */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>HOJAS INCLUIDAS:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {r.hojas.map(h => (
                    <span key={h} style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                      background: '#0f172a', border: '1px solid #334155', color: '#94a3b8'
                    }}>{h}</span>
                  ))}
                </div>
              </div>

              {/* Botón descargar */}
              <button
                onClick={() => descargar(r.id)}
                disabled={descargando[r.id]}
                style={{
                  width: '100%', padding: '11px', borderRadius: '8px', border: 'none',
                  background: descargando[r.id] ? '#334155' : '#F5C100',
                  color: descargando[r.id] ? '#64748b' : '#0a0a0a',
                  fontSize: '13px', fontWeight: '600', cursor: descargando[r.id] ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.15s'
                }}
              >
                {descargando[r.id] ? (
                  <>⏳ Generando reporte...</>
                ) : (
                  <>⬇️ Descargar Excel</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info adicional */}
      <div style={{ marginTop: '24px', background: '#1e293b', borderRadius: '10px', padding: '16px 20px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '12px', color: '#F5C100', fontWeight: '600', marginBottom: '8px' }}>ℹ️ INFORMACIÓN</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {[
            ['Formato', 'Microsoft Excel (.xlsx)'],
            ['Compatible con', 'Excel, LibreOffice, Google Sheets'],
            ['Colores', 'Verde=OK, Amarillo=Bajo, Rojo=Sin stock'],
            ['Actualización', 'Datos en tiempo real al descargar'],
          ].map(([k, v]) => (
            <div key={k}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{k}: </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
