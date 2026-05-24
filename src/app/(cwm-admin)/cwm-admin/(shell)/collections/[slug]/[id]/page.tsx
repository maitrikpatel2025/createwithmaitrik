'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '../../../../../lib/api'
import { getCollectionDef, type CollectionDef, type FieldDef } from '../../../../../lib/config'
import { FieldList } from '../../../../../components/FormFields'

export default function DocumentEditPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const id = params.id as string
  const isCreate = id === 'create'

  const [config, setConfig] = useState<CollectionDef | null>(null)
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(!isCreate)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const def = getCollectionDef(slug)
    if (!def) {
      router.replace('/cwm-admin')
      return
    }
    setConfig(def)
  }, [slug, router])

  useEffect(() => {
    if (!config || isCreate) return

    const fetchDoc = async () => {
      setLoading(true)
      try {
        const doc = await api.get(slug, id, 2)
        setData(doc)
      } catch (err) {
        console.error('Failed to fetch document:', err)
        showToast('Failed to load document', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchDoc()
  }, [slug, id, config, isCreate])

  const handleChange = useCallback((name: string, value: any) => {
    setData(prev => ({ ...prev, [name]: value }))
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    if (!config) return
    setSaving(true)

    try {
      // Build payload — strip internal Payload fields
      const payload: Record<string, any> = {}
      const allFields = config.tabs
        ? config.tabs.flatMap(t => flattenFields(t.fields))
        : flattenFields(config.fields || [])

      for (const field of allFields) {
        if (field.readOnly) continue
        const val = data[field.name]
        // For upload fields, send the ID only
        if (field.type === 'upload' && typeof val === 'object' && val !== null) {
          payload[field.name] = val.id
        } else if (val !== undefined) {
          payload[field.name] = val
        }
      }

      if (isCreate) {
        const result = await api.create(slug, payload)
        showToast(`${config.label} created`, 'success')
        router.replace(`/cwm-admin/collections/${slug}/${result.doc.id}`)
      } else {
        await api.update(slug, id, payload)
        showToast('Saved successfully', 'success')
      }
    } catch (err: any) {
      console.error('Save failed:', err)
      showToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!config) return
    try {
      await api.delete(slug, id)
      showToast(`${config.label} deleted`, 'success')
      router.replace(`/cwm-admin/collections/${slug}`)
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error')
    }
    setShowDelete(false)
  }

  if (!config) return null

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner" />
        <span>Loading…</span>
      </div>
    )
  }

  const titleField = config.useAsTitle || 'title'
  const docTitle = data[titleField] || (isCreate ? `New ${config.label}` : `${config.label} #${id}`)

  return (
    <>
      {/* Breadcrumb */}
      <div className="adm-breadcrumb">
        <Link href="/cwm-admin">Dashboard</Link>
        <span className="adm-breadcrumb__sep">/</span>
        <Link href={`/cwm-admin/collections/${slug}`}>{config.labelPlural}</Link>
        <span className="adm-breadcrumb__sep">/</span>
        <span>{isCreate ? 'Create' : 'Edit'}</span>
      </div>

      {/* Back link */}
      <Link href={`/cwm-admin/collections/${slug}`} className="adm-page-header__back">
        ← Back to {config.labelPlural}
      </Link>

      {/* Header */}
      <div className="adm-page-header">
        <h1 className="adm-page-header__title">{docTitle}</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {!isCreate && (
            <button
              className="adm-btn adm-btn--secondary adm-btn--sm"
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
          )}
          <button
            className="adm-btn adm-btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : isCreate ? 'Create' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabbed form for collections with tabs */}
      {config.tabs ? (
        <>
          <div className="adm-tabs">
            {config.tabs.map((tab, i) => (
              <button
                key={tab.label}
                className={`adm-tab ${activeTab === i ? 'adm-tab--active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="adm-form-card">
            <FieldList
              fields={config.tabs[activeTab].fields}
              data={data}
              onChange={handleChange}
            />
          </div>
        </>
      ) : (
        <div className="adm-form-card">
          <FieldList
            fields={config.fields || []}
            data={data}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Meta bar */}
      {!isCreate && data.updatedAt && (
        <div className="adm-meta-bar">
          {data.updatedAt && (
            <span>Last modified: {formatTimestamp(data.updatedAt)}</span>
          )}
          {data.createdAt && (
            <span>Created: {formatTimestamp(data.createdAt)}</span>
          )}
          <span>ID: {id}</span>
        </div>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="adm-dialog-overlay" onClick={() => setShowDelete(false)}>
          <div className="adm-dialog" onClick={e => e.stopPropagation()}>
            <h3 className="adm-dialog__title">Delete {config.label}?</h3>
            <p className="adm-dialog__desc">
              This action cannot be undone. Are you sure you want to delete &ldquo;{docTitle}&rdquo;?
            </p>
            <div className="adm-dialog__actions">
              <button className="adm-btn adm-btn--secondary adm-btn--sm" onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  )
}

// ───────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────

function flattenFields(fields: FieldDef[]): FieldDef[] {
  const result: FieldDef[] = []
  for (const field of fields) {
    if (field.type === 'row' || field.type === 'collapsible') {
      if (field.fields) result.push(...flattenFields(field.fields))
    } else {
      result.push(field)
    }
  }
  return result
}

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ts
  }
}
