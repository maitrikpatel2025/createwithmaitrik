'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type NavCount = Record<string, number>

const collectionItems = [
  { slug: 'playbooks', label: 'Playbooks', icon: '📓' },
  { slug: 'tools', label: 'Tools', icon: '🔧' },
  { slug: 'services', label: 'Services', icon: '💼' },
  { slug: 'newsletter-issues', label: 'Newsletter Issues', icon: '📬' },
  { slug: 'inquiries', label: 'Inquiries', icon: '📩' },
  { slug: 'media', label: 'Media', icon: '🖼' },
]

const globalItems = [
  { slug: 'site-settings', label: 'Site Settings', icon: '⚙' },
  { slug: 'lead-magnet', label: 'Lead Magnet', icon: '🧲' },
  { slug: 'paid-offer', label: 'Paid Offer', icon: '💰' },
  { slug: 'media-kit-stats', label: 'Media Kit Stats', icon: '📊' },
]

const adminItems = [
  { slug: 'users', label: 'Users', icon: '👤' },
]

const Nav: React.FC = () => {
  const pathname = usePathname()
  const [counts, setCounts] = useState<NavCount>({})

  useEffect(() => {
    const fetchCounts = async () => {
      const slugs = [...collectionItems, ...adminItems].map((c) => c.slug)
      const results: NavCount = {}

      await Promise.all(
        slugs.map(async (slug) => {
          try {
            const res = await fetch(`/api/${slug}?limit=0&depth=0`)
            if (res.ok) {
              const data = await res.json()
              results[slug] = data.totalDocs ?? 0
            }
          } catch {
            // ignore fetch errors
          }
        }),
      )

      setCounts(results)
    }

    fetchCounts()
  }, [pathname])

  const isActive = (slug: string, type: 'collections' | 'globals') => {
    if (type === 'collections') {
      return pathname === `/admin/collections/${slug}` || pathname.startsWith(`/admin/collections/${slug}/`)
    }
    return pathname === `/admin/globals/${slug}` || pathname.startsWith(`/admin/globals/${slug}/`)
  }

  const isDashboardActive = pathname === '/admin' || pathname === '/admin/'

  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1a1a1e',
        color: '#a1a1a6',
        fontFamily: '"Inter", -apple-system, sans-serif',
        overflow: 'auto',
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid #2c2c2e',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0071e3 0%, #0058b0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            flexShrink: 0,
          }}
        >
          M
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span
            style={{
              color: '#ffffff',
              fontFamily: '"Space Grotesk", "Inter", sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '-0.01em',
            }}
          >
            Maitrik Patel
          </span>
          <span
            style={{
              color: '#636366',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Admin · v1.0
          </span>
        </div>
      </div>

      {/* Dashboard link */}
      <div style={{ padding: '12px 8px 4px' }}>
        <a
          href="/admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            color: isDashboardActive ? '#ffffff' : '#a1a1a6',
            background: isDashboardActive ? 'rgba(0, 113, 227, 0.15)' : 'transparent',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: isDashboardActive ? 600 : 400,
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>📋</span>
          Dashboard
        </a>
      </div>

      {/* Collections */}
      <NavGroup label="Collections">
        {collectionItems.map((item) => (
          <NavItem
            key={item.slug}
            href={`/admin/collections/${item.slug}`}
            label={item.label}
            icon={item.icon}
            count={counts[item.slug]}
            active={isActive(item.slug, 'collections')}
          />
        ))}
      </NavGroup>

      {/* Globals */}
      <NavGroup label="Globals">
        {globalItems.map((item) => (
          <NavItem
            key={item.slug}
            href={`/admin/globals/${item.slug}`}
            label={item.label}
            icon={item.icon}
            active={isActive(item.slug, 'globals')}
          />
        ))}
      </NavGroup>

      {/* Admin */}
      <NavGroup label="Admin">
        {adminItems.map((item) => (
          <NavItem
            key={item.slug}
            href={`/admin/collections/${item.slug}`}
            label={item.label}
            icon={item.icon}
            count={counts[item.slug]}
            active={isActive(item.slug, 'collections')}
          />
        ))}
      </NavGroup>

      {/* Bottom spacer */}
      <div style={{ flex: 1 }} />

      {/* View live site link */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #2c2c2e',
          flexShrink: 0,
        }}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 12px',
            borderRadius: '8px',
            color: '#636366',
            textDecoration: 'none',
            fontSize: '12px',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.04em',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '12px' }}>↗</span>
          View live site
        </a>
      </div>
    </nav>
  )
}

/* ---------- Nav Group ---------- */
function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '4px 0' }}>
      <div
        style={{
          padding: '12px 20px 6px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#48484a',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div style={{ padding: '0 8px' }}>{children}</div>
    </div>
  )
}

/* ---------- Nav Item ---------- */
function NavItem({
  href,
  label,
  icon,
  count,
  active,
}: {
  href: string
  label: string
  icon: string
  count?: number
  active: boolean
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderRadius: '8px',
        color: active ? '#ffffff' : '#a1a1a6',
        background: active ? 'rgba(0, 113, 227, 0.15)' : 'transparent',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: active ? 500 : 400,
        transition: 'all 0.15s ease',
        marginBottom: '1px',
      }}
    >
      <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            color: active ? 'rgba(255,255,255,0.7)' : '#48484a',
            fontWeight: 500,
          }}
        >
          {count}
        </span>
      )}
    </a>
  )
}

export default Nav
