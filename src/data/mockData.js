// ── Analytics mock data ──────────────────────────────────────────────────────

const now = new Date()

function daysAgo(n) {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function buildRevenueSeries(days, base, variance) {
  return Array.from({ length: days }, (_, i) => ({
    date: daysAgo(days - 1 - i),
    receita: Math.round(base + (Math.random() - 0.4) * variance),
    usuarios: Math.round((base / 100) + (Math.random() - 0.4) * (variance / 80)),
  }))
}

export const analyticsData = {
  '7d': {
    series: buildRevenueSeries(7, 12000, 8000),
    metrics: {
      receita:    { value: 84200,  change: +12.4 },
      clientes:   { value: 1247,   change: +8.1  },
      pedidos:    { value: 3821,   change: +5.3  },
      conversao:  { value: 3.74,   change: -0.6  },
    },
  },
  '30d': {
    series: buildRevenueSeries(30, 15000, 10000),
    metrics: {
      receita:    { value: 312800, change: +21.7 },
      clientes:   { value: 4892,   change: +14.2 },
      pedidos:    { value: 14203,  change: +9.8  },
      conversao:  { value: 4.12,   change: +0.8  },
    },
  },
  '1y': {
    series: buildRevenueSeries(12, 120000, 60000).map((d, i) => ({
      ...d,
      date: new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
        .toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    })),
    metrics: {
      receita:    { value: 1820400, change: +38.2 },
      clientes:   { value: 28470,   change: +52.1 },
      pedidos:    { value: 97230,   change: +31.4 },
      conversao:  { value: 3.98,    change: +1.2  },
    },
  },
}

export const categoryData = [
  { name: 'Software',    value: 38, color: '#7B3FE4' },
  { name: 'Hardware',    value: 22, color: '#9B6FFF' },
  { name: 'Suporte',     value: 18, color: '#5B2FA8' },
  { name: 'Consultoria', value: 13, color: '#B89FFF' },
  { name: 'Outros',      value: 9,  color: '#3D1F7A' },
]

const statuses = ['Pago', 'Pago', 'Pago', 'Pendente', 'Cancelado']
const clients  = [
  'Acme Corp', 'Bravura Tech', 'Cloud Nine', 'Delta IO', 'Epoch Labs',
  'Fintech Hub', 'Gearbox SA', 'Hyper Systems', 'Indigo SaaS', 'Jade Digital',
]

export const transactions = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(now)
  d.setDate(d.getDate() - Math.floor(Math.random() * 14))
  return {
    id: `#${10042 + i}`,
    client: clients[i % clients.length],
    date: d.toLocaleDateString('pt-BR'),
    value: Math.round(800 + Math.random() * 9200),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }
}).sort((a, b) => b.id.localeCompare(a.id))

// ── Infrastructure mock data ──────────────────────────────────────────────────

export const servers = [
  { id: 'r1',   name: 'Router Principal',  icon: 'router',   uptime: 99.97, latency: 4,  cpu: 18, ram: 32 },
  { id: 'web1', name: 'Servidor Web 01',   icon: 'server',   uptime: 99.91, latency: 12, cpu: 54, ram: 61 },
  { id: 'web2', name: 'Servidor Web 02',   icon: 'server',   uptime: 99.85, latency: 15, cpu: 48, ram: 55 },
  { id: 'db1',  name: 'Banco de Dados',    icon: 'database', uptime: 99.99, latency: 8,  cpu: 72, ram: 78 },
  { id: 'cdn1', name: 'CDN Edge US',       icon: 'globe',    uptime: 100,   latency: 3,  cpu: 22, ram: 28 },
  { id: 'mon1', name: 'Monitor / Métricas',icon: 'activity', uptime: 99.78, latency: 9,  cpu: 35, ram: 44 },
]

// Generate initial realtime series (60 points, ~2 min of history)
function genSeries(base, spread, len = 60) {
  let v = base
  return Array.from({ length: len }, (_, i) => {
    v = Math.max(1, Math.min(99, v + (Math.random() - 0.48) * spread))
    return { t: i, value: Math.round(v) }
  })
}

export function getInitialRealtimeSeries() {
  return {
    latency: genSeries(18, 8),
    cpu:     genSeries(55, 12),
    rede:    genSeries(38, 15),
  }
}

export function nextPoint(series, base, spread) {
  const last = series[series.length - 1]
  const newVal = Math.max(1, Math.min(99, last.value + (Math.random() - 0.48) * spread))
  return [...series.slice(1), { t: last.t + 1, value: Math.round(newVal) }]
}

// ── Event log ────────────────────────────────────────────────────────────────

const logTemplates = [
  { level: 'info',    tmpl: (s) => `${s.name} — latência estável (${s.latency}ms)` },
  { level: 'success', tmpl: (s) => `${s.name} — health check OK (uptime ${s.uptime}%)` },
  { level: 'warning', tmpl: (s) => `${s.name} — pico de CPU detectado (${Math.floor(70+Math.random()*25)}%)` },
  { level: 'error',   tmpl: (s) => `${s.name} — timeout de conexão (5000ms)` },
  { level: 'info',    tmpl: (s) => `${s.name} — backup iniciado automaticamente` },
  { level: 'success', tmpl: (s) => `${s.name} — deploy concluído com sucesso` },
  { level: 'warning', tmpl: (s) => `${s.name} — uso de RAM acima de 80%` },
]

export function generateLogEntry(serverList) {
  const s = serverList[Math.floor(Math.random() * serverList.length)]
  const tpl = logTemplates[Math.floor(Math.random() * logTemplates.length)]
  const ts = new Date().toLocaleTimeString('pt-BR', { hour12: false })
  return { id: Date.now(), ts, level: tpl.level, msg: tpl.tmpl(s), server: s.id }
}

export function getInitialLogs(serverList, count = 12) {
  return Array.from({ length: count }, (_, i) => {
    const s = serverList[i % serverList.length]
    const tpl = logTemplates[i % logTemplates.length]
    const d = new Date()
    d.setSeconds(d.getSeconds() - (count - i) * 18)
    const ts = d.toLocaleTimeString('pt-BR', { hour12: false })
    return { id: i, ts, level: tpl.level, msg: tpl.tmpl(s), server: s.id }
  })
}

// ── Topology nodes (SVG positions) ───────────────────────────────────────────
export const topoNodes = [
  { id: 'r1',   x: 50,  y: 50,  label: 'Router' },
  { id: 'web1', x: 20,  y: 75,  label: 'Web 01' },
  { id: 'web2', x: 80,  y: 75,  label: 'Web 02' },
  { id: 'db1',  x: 50,  y: 85,  label: 'DB'     },
  { id: 'cdn1', x: 15,  y: 30,  label: 'CDN'    },
  { id: 'mon1', x: 85,  y: 30,  label: 'Monitor' },
]

export const topoEdges = [
  ['r1','web1'], ['r1','web2'], ['r1','db1'],
  ['r1','cdn1'], ['r1','mon1'], ['web1','db1'], ['web2','db1'],
]
