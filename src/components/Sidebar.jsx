import { BarChart2, Monitor, Zap } from 'lucide-react'

const NAV = [
  { id: 'analytics',    label: 'Analytics',      icon: BarChart2 },
  { id: 'monitoring',   label: 'Monitoramento',  icon: Monitor   },
]

export default function Sidebar({ view, setView }) {
  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 z-30"
      style={{
        background: 'rgba(22,22,22,0.85)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: 'var(--purple)', boxShadow: '0 0 16px rgba(123,63,228,.5)' }}
        >
          <Zap size={16} color="#fff" fill="#fff" />
        </div>
        <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Nexo Dashboard
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 16px 12px' }} />

      {/* Nav label */}
      <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
        Visões
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 w-full"
              style={{
                background: active ? 'var(--purple-dim)' : 'transparent',
                border: active ? '1px solid rgba(123,63,228,.35)' : '1px solid transparent',
                color: active ? 'var(--purple-light)' : 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

    </aside>
  )
}
