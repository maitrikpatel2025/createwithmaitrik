'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '../../lib/api'
import { useAdmin } from '../../components/AdminProvider'

type Stats = {
  // Content
  playbooks: number
  published: number
  inquiries: number
  featured: number
  tools: number
  services: number
  media: number
  newsletter: number
  // CRM
  contacts: number
  companies: number
  deals: number
  invoices: number
  tasks: number
  appointments: number
}

type RecentDoc = {
  id: string | number
  title: string
  collection: string
  collectionLabel: string
  icon: string
  updatedAt: string
}

export default function DashboardPage() {
  const { user } = useAdmin()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentDoc[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          playbooks, tools, services, media, newsletter, inquiries,
          contacts, companies, deals, invoices, tasks, appointments,
        ] = await Promise.all([
          api.list('playbooks', { limit: 0 }),
          api.list('tools', { limit: 0 }),
          api.list('services', { limit: 0 }),
          api.list('media', { limit: 0 }),
          api.list('newsletter-issues', { limit: 0 }),
          api.list('inquiries', { limit: 0 }),
          api.list('contacts', { limit: 0 }),
          api.list('companies', { limit: 0 }),
          api.list('deals', { limit: 0 }),
          api.list('invoices', { limit: 0 }),
          api.list('team-tasks', { limit: 0 }),
          api.list('appointments', { limit: 0 }),
        ])

        const publishedRes = await api.list('playbooks', {
          limit: 0,
          where: { status: { equals: 'published' } },
        })
        const featuredRes = await api.list('playbooks', {
          limit: 0,
          where: { featured: { equals: true } },
        })

        setStats({
          playbooks: playbooks.totalDocs,
          published: publishedRes.totalDocs,
          inquiries: inquiries.totalDocs,
          featured: featuredRes.totalDocs,
          tools: tools.totalDocs,
          services: services.totalDocs,
          media: media.totalDocs,
          newsletter: newsletter.totalDocs,
          contacts: contacts.totalDocs,
          companies: companies.totalDocs,
          deals: deals.totalDocs,
          invoices: invoices.totalDocs,
          tasks: tasks.totalDocs,
          appointments: appointments.totalDocs,
        })
      } catch (err) {
        console.error('Failed to load stats:', err)
      }
    }

    const fetchRecent = async () => {
      try {
        const [recentDeals, recentContacts, recentTasks, recentPlaybooks] = await Promise.all([
          api.list('deals', { limit: 3, sort: '-updatedAt' }),
          api.list('contacts', { limit: 3, sort: '-updatedAt' }),
          api.list('team-tasks', { limit: 3, sort: '-updatedAt' }),
          api.list('playbooks', { limit: 3, sort: '-updatedAt' }),
        ])

        const items: RecentDoc[] = [
          ...recentDeals.docs.map((d: any) => ({
            id: d.id, title: d.title || `Deal #${d.id}`, collection: 'deals',
            collectionLabel: 'Deal', icon: '🤝', updatedAt: d.updatedAt,
          })),
          ...recentContacts.docs.map((d: any) => ({
            id: d.id, title: d.email || d.name || `Contact #${d.id}`, collection: 'contacts',
            collectionLabel: 'Contact', icon: '👥', updatedAt: d.updatedAt,
          })),
          ...recentTasks.docs.map((d: any) => ({
            id: d.id, title: d.title || `Task #${d.id}`, collection: 'team-tasks',
            collectionLabel: 'Task', icon: '✅', updatedAt: d.updatedAt,
          })),
          ...recentPlaybooks.docs.map((d: any) => ({
            id: d.id, title: d.title || `Playbook #${d.id}`, collection: 'playbooks',
            collectionLabel: 'Playbook', icon: '📖', updatedAt: d.updatedAt,
          })),
        ]

        items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        setRecent(items.slice(0, 8))
      } catch (err) {
        console.error('Failed to load recent docs:', err)
      }
    }

    fetchStats()
    fetchRecent()
  }, [])

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    } catch {
      return d
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="adm-breadcrumb">
        <span>MAITRIKPATEL.IO</span>
        <span className="adm-breadcrumb__sep">/</span>
        <span>ADMIN</span>
      </div>

      {/* Welcome */}
      <h1 className="adm-welcome">
        Welcome back{user?.name ? `, ${user.name}` : ''}
      </h1>
      <p className="adm-welcome-sub">Here&apos;s what&apos;s happening across your business.</p>

      {/* CRM Stat Cards */}
      <div className="adm-stats-grid">
        <Link href="/cwm-admin/collections/contacts" className="adm-stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="adm-stat-card__accent adm-stat-card__accent--blue" />
          <div className="adm-stat-card__body">
            <div className="adm-stat-card__value">{stats?.contacts ?? '—'}</div>
            <div className="adm-stat-card__label">Contacts</div>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/deals" className="adm-stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="adm-stat-card__accent adm-stat-card__accent--green" />
          <div className="adm-stat-card__body">
            <div className="adm-stat-card__value">{stats?.deals ?? '—'}</div>
            <div className="adm-stat-card__label">Open Deals</div>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/invoices" className="adm-stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="adm-stat-card__accent adm-stat-card__accent--orange" />
          <div className="adm-stat-card__body">
            <div className="adm-stat-card__value">{stats?.invoices ?? '—'}</div>
            <div className="adm-stat-card__label">Invoices</div>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/team-tasks" className="adm-stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="adm-stat-card__accent adm-stat-card__accent--yellow" />
          <div className="adm-stat-card__body">
            <div className="adm-stat-card__value">{stats?.tasks ?? '—'}</div>
            <div className="adm-stat-card__label">Tasks</div>
          </div>
        </Link>
      </div>

      {/* Quick Stats — CRM + Content */}
      <div className="adm-quick-stats">
        <Link href="/cwm-admin/collections/appointments" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">📅</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.appointments ?? '—'}</span>
            <span className="adm-quick-stat__label">Appointments</span>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/companies" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">🏢</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.companies ?? '—'}</span>
            <span className="adm-quick-stat__label">Companies</span>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/pipelines" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">🔀</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.playbooks ?? '—'}</span>
            <span className="adm-quick-stat__label">Pipelines</span>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/inquiries" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">📩</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.inquiries ?? '—'}</span>
            <span className="adm-quick-stat__label">Inquiries</span>
          </div>
        </Link>
      </div>

      {/* Content Stats */}
      <div className="adm-quick-stats" style={{ marginTop: 0 }}>
        <Link href="/cwm-admin/collections/playbooks" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">📖</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.playbooks ?? '—'}</span>
            <span className="adm-quick-stat__label">Playbooks</span>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/inquiries" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">📩</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.inquiries ?? '—'}</span>
            <span className="adm-quick-stat__label">Inquiries</span>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/tools" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">🛠️</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.tools ?? '—'}</span>
            <span className="adm-quick-stat__label">Tools</span>
          </div>
        </Link>
        <Link href="/cwm-admin/collections/media" className="adm-quick-stat">
          <span className="adm-quick-stat__icon">🖼️</span>
          <div className="adm-quick-stat__info">
            <span className="adm-quick-stat__value">{stats?.media ?? '—'}</span>
            <span className="adm-quick-stat__label">Media</span>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="adm-recent-card">
        <div className="adm-recent-card__header">Recent Activity</div>
        {recent.length === 0 ? (
          <div className="adm-empty">
            <p className="adm-empty__desc">No recent activity</p>
          </div>
        ) : (
          recent.map(doc => (
            <Link
              key={`${doc.collection}-${doc.id}`}
              href={`/cwm-admin/collections/${doc.collection}/${doc.id}`}
              className="adm-recent-card__item"
            >
              <span className="adm-recent-card__item-title">
                <span style={{ marginRight: 6 }}>{doc.icon}</span>
                {doc.title}
                <span style={{ opacity: 0.5, marginLeft: 8, fontSize: '0.8em' }}>{doc.collectionLabel}</span>
              </span>
              <span className="adm-recent-card__item-meta">{formatDate(doc.updatedAt)}</span>
            </Link>
          ))
        )}
      </div>
    </>
  )
}
