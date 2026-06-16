import { useState } from 'react'
import { DollarSign, Users, ShoppingCart, TrendingUp, Calendar } from 'lucide-react'
import MetricCard from '../components/analytics/MetricCard'
import RevenueChart from '../components/analytics/RevenueChart'
import CategoryChart from '../components/analytics/CategoryChart'
import TransactionsTable from '../components/analytics/TransactionsTable'
import { analyticsData } from '../data/mockData'

const PERIODS = [
  { id: '7d',  label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: '1y',  label: 'Ano'    },
]

const METRIC_CONFIG = [
  { key: 'receita',   label: 'Receita Total',      icon: DollarSign,  type: 'currency' },
  { key: 'clientes',  label: 'Novos Clientes',     icon: Users,       type: 'number'  },
  { key: 'pedidos',   label: 'Pedidos',            icon: ShoppingCart,type: 'number'  },
  { key: 'conversao', label: 'Taxa de Conversão',  icon: TrendingUp,  type: 'percent' },
]

export default function AnalyticsView() {
  const [period, setPeriod] = useState('7d')
  const data = analyticsData[period]

  return (
    <div className="fade-in flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Visão Geral
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Métricas de negócio e performance comercial
          </p>
        </div>

        {/* Period filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl self-start sm:self-auto"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <Calendar size={14} style={{ color: 'var(--text-secondary)', margin: '0 6px' }} />
          {PERIODS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: period === id ? 'var(--purple)' : 'transparent',
                color: period === id ? '#fff' : 'var(--text-secondary)',
                boxShadow: period === id ? '0 2px 12px rgba(123,63,228,.4)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {METRIC_CONFIG.map(({ key, label, icon, type }) => (
          <MetricCard
            key={`${key}-${period}`}
            label={label}
            value={data.metrics[key].value}
            change={data.metrics[key].change}
            icon={icon}
            type={type}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart data={data.series} metric="receita" />
        </div>
        <div>
          <CategoryChart />
        </div>
      </div>

      {/* Transactions */}
      <TransactionsTable />
    </div>
  )
}
