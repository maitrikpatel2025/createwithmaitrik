'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '../../../../lib/api'
import { getGlobalDef, type GlobalDef, type FieldDef } from '../../../../lib/config'
import { FieldList } from '../../../../components/FormFields'

export default function GlobalEditPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [config, setConfig] = useState<GlobalDef | null>(null)
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const def = getGlobalDef(slug)
    if (!def) {
      router.replace('/cwm-admin')
      return
    }
    setConfig(def)
  }, [slug, router])

  useEffect(() => {
    if (!config) return

    const fetchGlobal = async () => {
      setLoading(true)
      try {
        const result = await api.getGlobal(slug)
        setData(result)
      } catch (err) {
        console.error('Failed to fetch global:', err)
        showToast('Failed to load settings', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGlobal()
  }, [slug, config])

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
      // Build payload — only send fields defined in config
      const payload: Record<string, any> = {}
      const flatFields = flattenGlobalFields(config.fields)

      for (const field of flatFields) {
        const val = data[field.name]
        if (field.type === 'upload' && typeof val === 'object' && val !== null) {
          payload[field.name] = val.id
        } else if (val !== undefined) {
          payload[field.name] = val
        }
      }

      await api.updateGlobal(slug, payload)
      showToast('Settings saved', 'success')
    } catch (err: any) {
      console.error('Save failed:', err)
      showToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
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

  return (
    <>
      {/* Breadcrumb */}
      <div className="adm-breadcrumb">
        <Link href="/cwm-admin">Dashboard</Link>
        <span className="adm-breadcrumb__sep">/</span>
        <span>{config.label}</span>
      </div>

      {/* Header */}
      <div className="adm-page-header">
        <h1 className="adm-page-header__title">{config.icon} {config.label}</h1>
        <button
          className="adm-btn adm-btn--primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {config.description && (
        <p className="adm-welcome-sub" style={{ marginBottom: 24 }}>{config.description}</p>
      )}

      {/* Form */}
      <div className="adm-form-card">
        <FieldList
          fields={config.fields}
          data={data}
          onChange={handleChange}
        />
      </div>

      {/* Meta bar */}
      {data.updatedAt && (
        <div className="adm-meta-bar">
          <span>Last modified: {formatTimestamp(data.updatedAt)}</span>
          {data.createdAt && <span>Created: {formatTimestamp(data.createdAt)}</span>}
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

function flattenGlobalFields(fields: FieldDef[]): FieldDef[] {
  const result: FieldDef[] = []
  for (const field of fields) {
    if (field.type === 'row' || field.type === 'collapsible') {
      if (field.fields) result.push(...flattenGlobalFields(field.fields))
    } else {
      result.push(field)
    }
  }
  return result
}

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ts
  }
}
