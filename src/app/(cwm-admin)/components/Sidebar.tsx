'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { globals, getCollectionsByGroup } from '../lib/config'
import { api } from '../lib/api'
import { useAdmin } from './AdminProvider'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAdmin()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const groups = getCollectionsByGroup()

  useEffect(() => {
    const fetchCounts = async () => {
      const results: Record<string, number> = {}
      for (const group of groups) {
        for (const col of group.items) {
          try {
            const data = await api.list(col.slug, { limit: 0 })
            results[col.slug] = data.totalDocs
          } catch {
            results[col.slug] = 0
          }
        }
      }
      setCounts(results)
    }
    fetchCounts()
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <>
      {open && (
        <div className="adm-sidebar-overlay adm-sidebar-overlay--open" onClick={onClose} />
      )}
      <aside className={`adm-sidebar ${open ? 'adm-sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="adm-sidebar__logo">
          <div className="adm-sidebar__mark">M</div>
          <div className="adm-sidebar__brand-text">
            <span className="adm-sidebar__brand-name">Maitrik Patel</span>
            <span className="adm-sidebar__brand-version">Admin · V2.0</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="adm-sidebar__nav">
          {/* Dashboard */}
          <div className="adm-sidebar__group">
            <Link
              href="/cwm-admin"
              className={`adm-sidebar__link ${isActive('/cwm-admin') ? 'adm-sidebar__link--active' : ''}`}
              onClick={onClose}
            >
              <span className="adm-sidebar__link-icon">📊</span>
              <span className="adm-sidebar__link-label">Dashboard</span>
            </Link>
          </div>

          {/* Grouped Collections */}
          {groups.map(group => (
            <div key={group.group} className="adm-sidebar__group">
              <div className="adm-sidebar__group-label">{group.group}</div>
              {group.items.map(col => (
                <Link
                  key={col.slug}
                  href={`/cwm-admin/collections/${col.slug}`}
                  className={`adm-sidebar__link ${pathname.startsWith(`/cwm-admin/collections/${col.slug}`) ? 'adm-sidebar__link--active' : ''}`}
                  onClick={onClose}
                >
                  <span className="adm-sidebar__link-icon">{col.icon}</span>
                  <span className="adm-sidebar__link-label">{col.labelPlural}</span>
                  <span className="adm-sidebar__link-count">{counts[col.slug] ?? '—'}</span>
                </Link>
              ))}
            </div>
          ))}

          {/* Globals */}
          <div className="adm-sidebar__group">
            <div className="adm-sidebar__group-label">Globals</div>
            {globals.map(g => (
              <Link
                key={g.slug}
                href={`/cwm-admin/globals/${g.slug}`}
                className={`adm-sidebar__link ${pathname.startsWith(`/cwm-admin/globals/${g.slug}`) ? 'adm-sidebar__link--active' : ''}`}
                onClick={onClose}
              >
                <span className="adm-sidebar__link-icon">{g.icon}</span>
                <span className="adm-sidebar__link-label">{g.label}</span>
              </Link>
            ))}
          </div>

          {/* Admin */}
          <div className="adm-sidebar__group">
            <div className="adm-sidebar__group-label">Account</div>
            {user && (
              <div className="adm-sidebar__link" style={{ cursor: 'default', opacity: 0.5 }}>
                <span className="adm-sidebar__link-icon">👤</span>
                <span className="adm-sidebar__link-label" style={{ fontSize: 12 }}>{user.email}</span>
              </div>
            )}
            <button
              className="adm-sidebar__link"
              onClick={logout}
              style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
            >
              <span className="adm-sidebar__link-icon">🚪</span>
              <span className="adm-sidebar__link-label">Log Out</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="adm-sidebar__footer">
          <a href="/" target="_blank" rel="noopener noreferrer">
            ↗ View live site
          </a>
        </div>
      </aside>
    </>
  )
}
