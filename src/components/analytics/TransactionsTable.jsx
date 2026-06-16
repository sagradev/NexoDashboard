import { transactions } from '../../data/mockData'

const STATUS_STYLES = {
  Pago:      { bg: 'rgba(34,197,94,.12)',  text: '#22c55e', dot: '#22c55e' },
  Pendente:  { bg: 'rgba(234,179,8,.12)',  text: '#eab308', dot: '#eab308' },
  Cancelado: { bg: 'rgba(239,68,68,.12)',  text: '#ef4444', dot: '#ef4444' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pendente
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {status}
    </span>
  )
}

export default function TransactionsTable() {
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
            Últimas Transações
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {transactions.length} registros recentes
          </p>
        </div>
        <button
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
          style={{
            background: 'var(--purple-dim)',
            color: 'var(--purple-light)',
            border: '1px solid rgba(123,63,228,.3)',
          }}
        >
          Ver todos
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['ID', 'Cliente', 'Data', 'Valor', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-left pb-3 font-medium text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr
                key={tx.id}
                className="transition-colors duration-150"
                style={{ borderBottom: i < transactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="py-3 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{tx.id}</td>
                <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{tx.client}</td>
                <td className="py-3" style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                <td className="py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  R$ {tx.value.toLocaleString('pt-BR')}
                </td>
                <td className="py-3">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2">
        {transactions.slice(0, 6).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{tx.client}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{tx.date} · {tx.id}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                R$ {tx.value.toLocaleString('pt-BR')}
              </p>
              <StatusBadge status={tx.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
