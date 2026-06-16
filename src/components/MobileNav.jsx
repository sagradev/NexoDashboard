import { BarChart2, Monitor } from 'lucide-react'

const NAV = [
  { id: 'analytics',  label: 'Analytics',     icon: BarChart2 },
  { id: 'monitoring', label: 'Monitoramento', icon: Monitor   },
]

export default function MobileNav({ view, setView }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: 'rgba(16,16,16,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = view === id
        return (
          <button
            key={id}
            onClick={() => setView(id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-200"
            style={{ color: active ? 'var(--purple-light)' : 'var(--text-secondary)' }}
          >
            <Icon size={20} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
