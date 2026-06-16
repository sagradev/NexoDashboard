import { useState, useEffect, useRef } from 'react'
import {
  servers,
  getInitialRealtimeSeries,
  nextPoint,
  generateLogEntry,
  getInitialLogs,
} from '../data/mockData'
import ServerCard from '../components/monitoring/ServerCard'
import RealtimeChart from '../components/monitoring/RealtimeChart'
import EventLog from '../components/monitoring/EventLog'
import TopologyMap from '../components/monitoring/TopologyMap'

const SPREADS = { latency: 8, cpu: 12, rede: 15 }
const BASES   = { latency: 18, cpu: 55, rede: 38 }

// Randomly assign a status, weighted toward online
function randomStatus() {
  const r = Math.random()
  if (r < 0.75) return 'online'
  if (r < 0.90) return 'degraded'
  return 'offline'
}

function buildInitialStatuses() {
  return Object.fromEntries(servers.map(s => [s.id, randomStatus()]))
}

export default function MonitoringView() {
  const [series,   setSeries]   = useState(getInitialRealtimeSeries)
  const [logs,     setLogs]     = useState(() => getInitialLogs(servers))
  const [statuses, setStatuses] = useState(buildInitialStatuses)

  const seriesRef = useRef(series)
  seriesRef.current = series

  // Realtime updates every 2s
  useEffect(() => {
    const id = setInterval(() => {
      setSeries(prev => ({
        latency: nextPoint(prev.latency, BASES.latency, SPREADS.latency),
        cpu:     nextPoint(prev.cpu,     BASES.cpu,     SPREADS.cpu),
        rede:    nextPoint(prev.rede,    BASES.rede,    SPREADS.rede),
      }))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  // Log updates every 3-6s
  useEffect(() => {
    function scheduleLog() {
      const delay = 3000 + Math.random() * 3000
      const tid = setTimeout(() => {
        setLogs(prev => {
          const entry = generateLogEntry(servers)
          return [...prev.slice(-49), entry]
        })
        scheduleLog()
      }, delay)
      return tid
    }
    const tid = scheduleLog()
    return () => clearTimeout(tid)
  }, [])

  // Status changes every 10-20s
  useEffect(() => {
    const id = setInterval(() => {
      setStatuses(buildInitialStatuses)
    }, 12000)
    return () => clearInterval(id)
  }, [])

  // Count statuses
  const statusCount = Object.values(statuses)
  const offlineCount  = statusCount.filter(s => s === 'offline').length
  const degradedCount = statusCount.filter(s => s === 'degraded').length
  const allOk = offlineCount === 0 && degradedCount === 0

  const globalColor  = allOk ? '#22c55e' : degradedCount > 0 && offlineCount === 0 ? '#eab308' : '#ef4444'
  const globalPulse  = allOk ? 'pulse-green' : degradedCount > 0 && offlineCount === 0 ? 'pulse-yellow' : 'pulse-red'
  const globalLabel  = allOk
    ? 'Todos os sistemas operacionais'
    : offlineCount > 0
    ? `${offlineCount} servidor${offlineCount > 1 ? 'es' : ''} offline`
    : `${degradedCount} servidor${degradedCount > 1 ? 'es' : ''} degradado${degradedCount > 1 ? 's' : ''}`

  const enrichedServers = servers.map(s => ({ ...s, status: statuses[s.id] || 'online' }))

  return (
    <div className="fade-in flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Status da Infraestrutura
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Monitoramento em tempo real · simulado
          </p>
        </div>

        {/* Global status indicator */}
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl self-start sm:self-auto"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span
            className={`w-3 h-3 rounded-full flex-shrink-0 ${globalPulse}`}
            style={{ background: globalColor }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {globalLabel}
          </span>
        </div>
      </div>

      {/* Server cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {enrichedServers.map(server => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>

      {/* Chart + Log */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <RealtimeChart series={series} />
        </div>
        <div className="lg:col-span-2">
          <EventLog logs={logs} />
        </div>
      </div>

      {/* Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopologyMap serverStatuses={statuses} />

        {/* Quick stats */}
        <div
          className="rounded-2xl p-5 card-hover"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--purple-glow)',
          }}
        >
          <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Resumo do Cluster
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Servidores Ativos',   value: statusCount.filter(s => s === 'online').length,   color: '#22c55e', total: servers.length },
              { label: 'Degradados',          value: degradedCount,                                     color: '#eab308', total: servers.length },
              { label: 'Offline',             value: offlineCount,                                      color: '#ef4444', total: servers.length },
              { label: 'Latência Média',      value: `${Math.round(series.latency.slice(-5).reduce((a,b) => a + b.value, 0) / 5)} ms`, color: 'var(--purple-light)', raw: true },
              { label: 'CPU Média',           value: `${Math.round(series.cpu.slice(-5).reduce((a,b) => a + b.value, 0) / 5)}%`,      color: 'var(--purple-light)', raw: true },
            ].map(({ label, value, color, total, raw }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color }}>
                    {raw ? value : `${value}/${total}`}
                  </span>
                  {!raw && total && (
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(value / total) * 100}%`, background: color }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
