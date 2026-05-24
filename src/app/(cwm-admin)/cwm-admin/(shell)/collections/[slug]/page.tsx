'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, type PaginatedResponse } from '../../../../lib/api'
import { getCollectionDef, type CollectionDef } from '../../../../lib/config'

export default function CollectionListPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [config, setConfig] = useState<CollectionDef | null>(null)
  const [data, setData] = useState<PaginatedResponse | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const def = getCollectionDef(slug)
    if (!def) {
      router.replace('/cwm-admin')
      return
    }
    setConfig(def)
  }, [slug, router])

  const fetchData = useCallback(async () => {
    if (!config) return
    setLoading(true)
    try {
      const params: any = { page, limit: 20, sort: '-updatedAt' }

      // Search by title field
      if (search.trim()) {
        const titleField = config.useAsTitle || 'title'
        params.where = { [titleField]: { like: search.trim() } }
      }

      const res = await api.list(slug, params)
      setData(res)
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }, [slug, config, page, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  if (!config) return null

  const formatCellValue = (doc: any, col: typeof config.defaultColumns[0]) => {
    const value = doc[col.name]

    if (col.type === 'status') {
      const status = value || 'draft'
      return (
        <span className="adm-table__status">
          <span className={`adm-table__status-dot adm-table__status-dot--${status}`} />
          {status}
        </span>
      )
    }

    if (col.type === 'boolean') {
      return value ? <span className="adm-table__check">✓</span> : '—'
    }

    if (col.type === 'date' && value) {
      try {
        return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } catch {
        return value
      }
    }

    if (value === null || value === undefined) return '—'
    if (typeof value === 'object') return JSON.stringify(value).slice(0, 50)
    return String(value)
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="adm-breadcrumb">
        <Link href="/cwm-admin">Dashboard</Link>
        <span className="adm-breadcrumb__sep">/</span>
        <span>{config.labelPlural}</span>
      </div>

      {/* Page Header */}
      <div className="adm-page-header">
        <h1 className="adm-page-header__title">
          {config.icon} {config.labelPlural}
        </h1>
        {config.slug !== 'inquiries' && (
          <Link href={`/cwm-admin/collections/${slug}/create`} className="adm-btn adm-btn--primary">
            Create New
          </Link>
        )}
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search">
          <span className="adm-search__icon">🔍</span>
          <input
            className="adm-search__input"
            type="text"
            placeholder={`Search ${config.labelPlural.toLowerCase()}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="adm-table-card">
        {loading && !data ? (
          <div className="adm-loading">
            <div className="adm-spinner" />
            <span>Loading…</span>
          </div>
        ) : !data || data.docs.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty__icon">{config.icon}</div>
            <h3 className="adm-empty__title">No {config.labelPlural.toLowerCase()} yet</h3>
            <p className="adm-empty__desc">
              {search ? 'No results match your search.' : `Create your first ${config.label.toLowerCase()} to get started.`}
            </p>
            {!search && config.slug !== 'inquiries' && (
              <Link href={`/cwm-admin/collections/${slug}/create`} className="adm-btn adm-btn--primary adm-btn--sm">
                Create {config.label}
              </Link>
            )}
          </div>
        ) : (
          <>
            <table className="adm-table">
              <thead>
                <tr>
                  {config.defaultColumns.map(col => (
                    <th key={col.name}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.docs.map((doc: any) => (
                  <tr
                    key={doc.id}
                    onClick={() => router.push(`/cwm-admin/collections/${slug}/${doc.id}`)}
                  >
                    {config.defaultColumns.map(col => (
                      <td key={col.name}>{formatCellValue(doc, col)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="adm-pagination">
                <span className="adm-pagination__info">
                  Page {data.page} of {data.totalPages} · {data.totalDocs} total
                </span>
                <div className="adm-pagination__btns">
                  <button
                    className="adm-pagination__btn"
                    disabled={!data.hasPrevPage}
                    onClick={() => setPage(p => p - 1)}
                  >
                    ← Prev
                  </button>
                  <button
                    className="adm-pagination__btn"
                    disabled={!data.hasNextPage}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
