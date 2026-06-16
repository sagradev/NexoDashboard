import { Server, Database, Globe, Activity, Router, Wifi } from 'lucide-react'

const ICONS = { server: Server, database: Database, globe: Globe, activity: Activity, router: Wifi }

function StatusDot({ status }) {
  const map = {
    online:   { cls: 'pulse-green',  color: '#22c55e' },
    degraded: { cls: 'pulse-yellow', color: '#eab308' },
    offline:  { cls: 'pulse-red',    color: '#ef4444' },
  }
  const s = map[status] || map.online
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.cls}`}
      style={{ background: s.color }}
    />
  )
}

function MiniBar({ value, color }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  )
}

export default function ServerCard({ server }) {
  const { name, icon, uptime, latency, cpu, ram, status = 'online' } = server
  const Icon = ICONS[icon] || Server

  const cpuColor  = cpu  > 80 ? '#ef4444' : cpu  > 60 ? '#eab308' : '#22c55e'
  const ramColor  = ram  > 80 ? '#ef4444' : ram  > 60 ? '#eab308' : '#7B3FE4'

  return (
    <div
      className="card-hover rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--purple-glow)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--purple-dim)', border: '1px solid rgba(123,63,228,.25)' }}
          >
            <Icon size={18} style={{ color: 'var(--purple-light)' }} />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <StatusDot status={status} />
              <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                {status === 'online' ? 'Online' : status === 'degraded' ? 'Degradado' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-lg font-semibold"
          style={{ background: 'rgba(34,197,94,.1)', color: '#22c55e' }}
        >
          {uptime}%
        </span>
      </div>

      {/* Latency */}
      <div
        className="flex items-center justify-between rounded-xl px-3 py-2.5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Latência</span>
        <span className="text-sm font-bold" style={{ color: latency > 30 ? '#eab308' : '#22c55e' }}>
          {latency} ms
        </span>
      </div>

      {/* CPU & RAM bars */}
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>CPU</span>
            <span className="text-xs font-semibold" style={{ color: cpuColor }}>{cpu}%</span>
          </div>
          <MiniBar value={cpu} color={cpuColor} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>RAM</span>
            <span className="text-xs font-semibold" style={{ color: ramColor }}>{ram}%</span>
          </div>
          <MiniBar value={ram} color={ramColor} />
        </div>
      </div>
    </div>
  )
}
