import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import api from '../services/api'

function Stat({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>{label}</div>
      {sub && <div style={{ fontSize: '12px', color: color, marginTop: '4px', fontWeight: '600' }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/ventas/resumen')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ fontSize: '32px' }}>⏳</div>
    </div>
  )

  const ventasDia = data?.ventasPorDia?.map(v => ({
    fecha: new Date(v.fecha).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }),
    total: parseFloat(v.total || 0),
    cantidad: parseInt(v.cantidad || 0)
  })) || []

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <Stat icon="💰" label="Ventas hoy" value={`S/ ${parseFloat(data?.hoy?.total || 0).toFixed(2)}`}
          sub={`${data?.hoy?.cantidad || 0} transacciones`} color="#f97316" />
        <Stat icon="📅" label="Ventas este mes" value={`S/ ${parseFloat(data?.mes?.total || 0).toFixed(2)}`}
          sub={`${data?.mes?.cantidad || 0} transacciones`} color="#3b82f6" />
        <Stat icon="📦" label="Productos activos" value={data?.totalProductos || 0}
          color="#10b981" />
        <Stat icon="⏳" label="Pedidos pendientes" value={data?.pendientes || 0}
          sub="Requieren confirmación" color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Gráfico ventas */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' }}>
            Ventas — Últimos 7 días
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ventasDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => [`S/ ${v.toFixed(2)}`, 'Total']} />
              <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top productos */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px' }}>
            🏆 Top Productos del Mes
          </h2>
          {data?.topProductos?.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sin ventas aún este mes</p>
          )}
          {data?.topProductos?.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', background: '#fff7ed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '800', color: '#f97316', flexShrink: 0
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.nombre}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{parseInt(p.total_vendido)} unidades</div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981', flexShrink: 0 }}>
                S/ {parseFloat(p.total_ingresos).toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
