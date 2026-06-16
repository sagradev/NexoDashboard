import { topoNodes, topoEdges, servers } from '../../data/mockData'

const STATUS_COLOR = {
  online:   '#22c55e',
  degraded: '#eab308',
  offline:  '#ef4444',
}

export default function TopologyMap({ serverStatuses }) {
  const getColor = (id) => {
    const st = serverStatuses?.[id] || 'online'
    return STATUS_COLOR[st]
  }

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
        Topologia de Rede
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Mapa de conectividade</p>

      <svg
        viewBox="0 0 100 100"
        className="w-full"
        style={{ maxHeight: 220 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Edges */}
        {topoEdges.map(([a, b]) => {
          const na = topoNodes.find(n => n.id === a)
          const nb = topoNodes.find(n => n.id === b)
          if (!na || !nb) return null
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="rgba(123,63,228,0.35)"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
          )
        })}

        {/* Nodes */}
        {topoNodes.map(node => {
          const color = getColor(node.id)
          return (
            <g key={node.id}>
              {/* Outer ring */}
              <circle cx={node.x} cy={node.y} r={6.5} fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.5" />
              {/* Node fill */}
              <circle cx={node.x} cy={node.y} r={4.5} fill="#1A1A1A" stroke={color} strokeWidth="1.2" />
              {/* Inner dot */}
              <circle cx={node.x} cy={node.y} r={2} fill={color} />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + 11}
                textAnchor="middle"
                fontSize="4"
                fill="#9A9A9A"
                fontFamily="Inter, sans-serif"
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-2 justify-center">
        {[['online','#22c55e','Online'],['degraded','#eab308','Degradado'],['offline','#ef4444','Offline']].map(([k,c,l]) => (
          <span key={k} className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
