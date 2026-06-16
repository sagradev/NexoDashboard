import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import AnalyticsView from './views/AnalyticsView'
import MonitoringView from './views/MonitoringView'
import './index.css'

export default function App() {
  const [view, setView] = useState('analytics')

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Sidebar view={view} setView={setView} />

      {/* Main content — offset for sidebar on desktop */}
      <main
        className="flex-1 min-w-0 pb-20 md:pb-0 overflow-x-hidden"
      >
        {/* Top bar (mobile only) */}
        <div
          className="md:hidden flex items-center px-4 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--purple)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Nexo Dashboard</span>
          </div>
          <span
            className="ml-auto text-xs px-2 py-1 rounded-lg"
            style={{ background: 'var(--purple-dim)', color: 'var(--purple-light)', border: '1px solid rgba(123,63,228,.25)' }}
          >
            {view === 'analytics' ? 'Analytics' : 'Monitoramento'}
          </span>
        </div>

        <div className="p-4 md:p-8">
          {view === 'analytics'   && <AnalyticsView />}
          {view === 'monitoring'  && <MonitoringView />}
        </div>
      </main>

      <MobileNav view={view} setView={setView} />
    </div>
  )
}
