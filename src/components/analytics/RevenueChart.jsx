import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background: '#1E1E1E',
        border: '1px solid rgba(123,63,228,.35)',
        boxShadow: '0 8px 24px rgba(0,0,0,.5)',
      }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.dataKey === 'receita' ? '#9B6FFF' : '#60d8a4' }}>
          {p.dataKey === 'receita'
            ? `Receita: R$ ${p.value.toLocaleString('pt-BR')}`
            : `Usuários: ${p.value.toLocaleString('pt-BR')}`}
        </p>
      ))}
    </div>
  )
}

export default function RevenueChart({ data, metric = 'receita' }) {
  const isRevenue = metric === 'receita'
  const color     = isRevenue ? '#7B3FE4' : '#34d399'
  const gradId    = `grad-${metric}`

  return (
    <div
      className="rounded-2xl p-5 card-hover"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--purple-glow)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            {isRevenue ? 'Receita ao longo do tempo' : 'Usuários ativos'}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {isRevenue ? 'Valores em R$' : 'Contagem diária'}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#9A9A9A', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#9A9A9A', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={isRevenue ? (v) => `${(v/1000).toFixed(0)}k` : undefined}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(123,63,228,.3)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: '#0A0A0A', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
