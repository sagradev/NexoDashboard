import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const TABS = [
  { id: 'latency', label: 'Latência', unit: 'ms', color: '#7B3FE4', max: 100 },
  { id: 'cpu',     label: 'CPU',      unit: '%',  color: '#9B6FFF', max: 100 },
  { id: 'rede',    label: 'Rede',     unit: 'MB/s', color: '#34d399', max: 100 },
]

function CustomTooltip({ active, payload, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{ background: '#1E1E1E', border: '1px solid rgba(123,63,228,.35)' }}
    >
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        {payload[0].value} {unit}
      </p>
    </div>
  )
}

export default function RealtimeChart({ series }) {
  const [tab, setTab] = useState('latency')
  const cfg = TABS.find(t => t.id === tab)
  const data = series[tab] || []

  return (
    <div
      className="rounded-2xl p-5 card-hover"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--purple-glow)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            Métricas em Tempo Real
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Atualização a cada 2s
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: tab === t.id ? 'var(--purple)' : 'transparent',
                color: tab === t.id ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current value badge */}
      <div className="flex items-baseline gap-2 mb-4">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color: cfg.color, textShadow: `0 0 20px ${cfg.color}60` }}
        >
          {data[data.length - 1]?.value ?? '—'}
        </span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{cfg.unit}</span>
        <span
          className="ml-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(123,63,228,.15)', color: 'var(--purple-light)' }}
        >
          AO VIVO
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            domain={[0, cfg.max]}
            tick={{ fill: '#9A9A9A', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={28}
            tickFormatter={v => `${v}`}
          />
          <Tooltip content={<CustomTooltip unit={cfg.unit} />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={cfg.color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            filter="url(#glow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
