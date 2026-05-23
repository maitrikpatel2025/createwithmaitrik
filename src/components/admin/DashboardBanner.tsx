'use client'
import React, { useEffect, useState } from 'react'

interface Stats {
  playbooks: { total: number; published: number; drafts: number; featured: number }
  tools: number
  services: number
  inquiries: number
  media: number
  newsletterIssues: number
}

const DashboardBanner: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [playbooks, tools, services, inquiries, media, issues] = await Promise.all([
          fetch('/api/playbooks?limit=100&depth=0').then((r) => r.json()),
          fetch('/api/tools?limit=0&depth=0').then((r) => r.json()),
          fetch('/api/services?limit=0&depth=0').then((r) => r.json()),
          fetch('/api/inquiries?limit=0&depth=0').then((r) => r.json()),
          fetch('/api/media?limit=0&depth=0').then((r) => r.json()),
          fetch('/api/newsletter-issues?limit=0&depth=0').then((r) => r.json()),
        ])

        const docs = playbooks.docs || []
        const published = docs.filter((d: { status?: string }) => d.status === 'published').length
        const drafts = docs.filter((d: { status?: string }) => d.status === 'draft').length
        const featured = docs.filter((d: { featured?: boolean }) => d.featured).length

        setStats({
          playbooks: { total: playbooks.totalDocs ?? 0, published, drafts, featured },
          tools: tools.totalDocs ?? 0,
          services: services.totalDocs ?? 0,
          inquiries: inquiries.totalDocs ?? 0,
          media: media.totalDocs ?? 0,
          newsletterIssues: issues.totalDocs ?? 0,
        })
      } catch {
        // ignore
      }
    }

    fetchStats()
  }, [])

  if (!stats) {
    return (
      <div style={{ padding: '0 0 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1px solid #e8e8ed',
                borderRadius: '14px',
                padding: '24px',
                height: '100px',
                animation: 'pulse 1.5s ease infinite',
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 0 32px' }}>
      {/* Welcome header */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#86868b',
            marginBottom: '8px',
          }}
        >
          MAITRIKPATEL.IO / ADMIN
        </div>
        <h1
          style={{
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            letterSpacing: '-0.02em',
            color: '#1d1d1f',
            margin: '0 0 6px',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#86868b',
            margin: 0,
            lineHeight: '1.5',
          }}
        >
          Content overview for your site.
        </p>
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '8px',
        }}
      >
        <StatCard
          label="Playbooks"
          value={stats.playbooks.total}
          sub={`${stats.playbooks.published} published`}
          accent="#0071e3"
        />
        <StatCard
          label="Published"
          value={stats.playbooks.published}
          sub={`${stats.playbooks.drafts} drafts`}
          accent="#30d158"
        />
        <StatCard
          label="Inquiries"
          value={stats.inquiries}
          sub="form submissions"
          accent="#ff9f0a"
        />
        <StatCard
          label="Featured"
          value={stats.playbooks.featured}
          sub="of 3 homepage slots"
          accent="#bf5af2"
        />
      </div>

      {/* Quick stats row */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          padding: '12px 0',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          letterSpacing: '0.04em',
          color: '#86868b',
        }}
      >
        <span>
          Tools: <strong style={{ color: '#1d1d1f' }}>{stats.tools}</strong>
        </span>
        <span>
          Services: <strong style={{ color: '#1d1d1f' }}>{stats.services}</strong>
        </span>
        <span>
          Media: <strong style={{ color: '#1d1d1f' }}>{stats.media}</strong>
        </span>
        <span>
          Newsletter: <strong style={{ color: '#1d1d1f' }}>{stats.newsletterIssues}</strong>
        </span>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: number
  sub: string
  accent: string
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e8e8ed',
        borderRadius: '14px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: accent,
          borderRadius: '14px 14px 0 0',
        }}
      />
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#86868b',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
          fontWeight: 700,
          fontSize: '36px',
          letterSpacing: '-0.02em',
          color: '#1d1d1f',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '12px',
          color: '#86868b',
        }}
      >
        {sub}
      </span>
    </div>
  )
}

export default DashboardBanner
