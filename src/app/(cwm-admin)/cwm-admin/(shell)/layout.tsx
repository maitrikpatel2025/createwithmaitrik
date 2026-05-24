'use client'

import { useState } from 'react'
import { AdminProvider, useAdmin } from '../../components/AdminProvider'
import { Sidebar } from '../../components/Sidebar'

function ShellInner({ children }: { children: React.ReactNode }) {
  const { loading } = useAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="adm-loading" style={{ minHeight: '100vh' }}>
        <div className="adm-spinner" />
        <span>Loading…</span>
      </div>
    )
  }

  return (
    <div className="adm-shell">
      <button
        className="adm-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="adm-content">
        {children}
      </main>
    </div>
  )
}

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ShellInner>{children}</ShellInner>
    </AdminProvider>
  )
}
