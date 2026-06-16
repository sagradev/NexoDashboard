import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

function useCountUp(target, duration = 1200) {
  const [display, setDisplay] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const pct = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setDisplay(Math.round(eased * target))
      if (pct < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return display
}

function formatVal(val, type) {
  if (type === 'currency')  return `R$ ${val.toLocaleString('pt-BR')}`
  if (type === 'percent')   return `${(val / 100).toFixed(2)}%`
  return val.toLocaleString('pt-BR')
}

export default function MetricCard({ label, value, change, icon: Icon, type = 'number', color }) {
  const animated = useCountUp(type === 'percent' ? Math.round(value * 100) : value)
  const positive  = change >= 0

  return (
    <div
      className="card-hover rounded-2xl p-5 flex flex-col gap-4 count-up"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--purple-glow)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: color || 'var(--purple-dim)', border: '1px solid rgba(123,63,228,.2)' }}
        >
          <Icon size={18} style={{ color: 'var(--purple-light)' }} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {formatVal(animated, type)}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          {positive
            ? <TrendingUp size={13} style={{ color: '#22c55e' }} />
            : <TrendingDown size={13} style={{ color: '#ef4444' }} />
          }
          <span className="text-xs font-semibold" style={{ color: positive ? '#22c55e' : '#ef4444' }}>
            {positive ? '+' : ''}{change}%
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>vs período anterior</span>
        </div>
      </div>
    </div>
  )
}
