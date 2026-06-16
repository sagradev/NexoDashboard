import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { categoryData } from '../../data/mockData'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background: '#1E1E1E',
        border: '1px solid rgba(123,63,228,.35)',
        boxShadow: '0 8px 24px rgba(0,0,0,.5)',
      }}
    >
      <p className="font-semibold" style={{ color: d.payload.color }}>{d.name}</p>
      <p style={{ color: 'var(--text-primary)' }}>{d.value}% das vendas</p>
    </div>
  )
}

function CustomLegend() {
  return (
    <ul className="flex flex-col gap-2 mt-2">
      {categoryData.map((entry) => (
        <li key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
          <span className="ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>{entry.value}%</span>
        </li>
      ))}
    </ul>
  )
}

export default function CategoryChart() {
  return (
    <div
      className="rounded-2xl p-5 card-hover"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--purple-glow)',
      }}
    >
      <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
        Vendas por Categoria
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Distribuição percentual</p>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 min-w-0">
          <CustomLegend />
        </div>
      </div>
    </div>
  )
}
