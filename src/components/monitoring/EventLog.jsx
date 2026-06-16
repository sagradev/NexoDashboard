import { useRef, useEffect } from 'react'
import { Terminal } from 'lucide-react'

const LEVEL_STYLE = {
  info:    { color: '#9A9A9A', prefix: 'INFO ' },
  success: { color: '#22c55e', prefix: 'OK   ' },
  warning: { color: '#eab308', prefix: 'WARN ' },
  error:   { color: '#ef4444', prefix: 'ERR  ' },
}

export default function EventLog({ logs }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  return (
    <div
      className="rounded-2xl p-5 flex flex-col card-hover"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--purple-glow)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--purple-dim)', border: '1px solid rgba(123,63,228,.25)' }}
        >
          <Terminal size={15} style={{ color: 'var(--purple-light)' }} />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Log de Eventos</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Console em tempo real</p>
        </div>
        <div className="ml-auto flex gap-1.5 flex-shrink-0">
          {['#ef4444','#eab308','#22c55e'].map(c => (
            <span key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-y-auto rounded-xl p-4 font-mono text-xs flex flex-col gap-1.5"
        style={{
          background: 'var(--bg-deep)',
          border: '1px solid rgba(255,255,255,0.05)',
          minHeight: 220,
          maxHeight: 280,
        }}
      >
        {logs.map((log, i) => {
          const style = LEVEL_STYLE[log.level] || LEVEL_STYLE.info
          const isNew = i === logs.length - 1
          return (
            <div key={log.id} className={isNew ? 'log-entry' : ''}>
              <span style={{ color: '#3D3D5C' }}>[{log.ts}]</span>
              {' '}
              <span className="font-bold" style={{ color: style.color }}>{style.prefix}</span>
              <span style={{ color: '#F5F5F5' }}>{log.msg}</span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 mt-3 flex-wrap">
        {Object.entries(LEVEL_STYLE).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: v.color }} />
            <span style={{ color: 'var(--text-secondary)' }} className="capitalize">{k}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
