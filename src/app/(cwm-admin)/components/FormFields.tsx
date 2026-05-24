'use client'

import { useState, useRef } from 'react'
import type { FieldDef } from '../lib/config'
import { api } from '../lib/api'

// ───────────────────────────────────────────────────
// Main field renderer — dispatches by type
// ───────────────────────────────────────────────────

type FieldProps = {
  field: FieldDef
  value: any
  onChange: (name: string, value: any) => void
}

export function FormField({ field, value, onChange }: FieldProps) {
  // Row renders side-by-side fields
  if (field.type === 'row') {
    return (
      <div className="adm-field-row">
        {field.fields?.map(f => (
          <FormField key={f.name} field={f} value={value?.[f.name] ?? ''} onChange={onChange} />
        ))}
      </div>
    )
  }

  // Collapsible section
  if (field.type === 'collapsible') {
    return <CollapsibleField field={field} value={value} onChange={onChange} />
  }

  // Array field
  if (field.type === 'array') {
    return <ArrayField field={field} value={value} onChange={onChange} />
  }

  // Upload field
  if (field.type === 'upload') {
    return <UploadField field={field} value={value} onChange={onChange} />
  }

  // Standard fields
  return (
    <div className="adm-field">
      <label className={`adm-field__label ${field.required ? 'adm-field__label--required' : ''}`}>
        {field.label || field.name}
      </label>
      {field.description && <span className="adm-field__desc">{field.description}</span>}

      {field.type === 'textarea' ? (
        <textarea
          className={`adm-textarea ${(field.rows || 0) >= 20 ? 'adm-textarea--lg' : ''}`}
          value={value ?? ''}
          onChange={e => onChange(field.name, e.target.value)}
          rows={field.rows || 4}
          readOnly={field.readOnly}
        />
      ) : field.type === 'select' ? (
        <select
          className="adm-select"
          value={value ?? ''}
          onChange={e => onChange(field.name, e.target.value)}
          disabled={field.readOnly}
        >
          <option value="">— Select —</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === 'checkbox' ? (
        <label
          className="adm-checkbox-wrap"
          onClick={() => !field.readOnly && onChange(field.name, !value)}
        >
          <span className={`adm-checkbox ${value ? 'adm-checkbox--checked' : ''}`}>
            {value && '✓'}
          </span>
          <span className="adm-checkbox__label">{field.description || 'Enabled'}</span>
        </label>
      ) : field.type === 'date' ? (
        <input
          type="date"
          className="adm-input"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={e => onChange(field.name, e.target.value ? new Date(e.target.value).toISOString() : '')}
          readOnly={field.readOnly}
        />
      ) : field.type === 'number' ? (
        <input
          type="number"
          className="adm-input"
          value={value ?? ''}
          onChange={e => onChange(field.name, e.target.value ? Number(e.target.value) : '')}
          readOnly={field.readOnly}
        />
      ) : (
        <input
          type={field.type === 'email' ? 'email' : 'text'}
          className={`adm-input ${field.readOnly ? 'adm-input--readonly' : ''}`}
          value={value ?? ''}
          onChange={e => onChange(field.name, e.target.value)}
          readOnly={field.readOnly}
          placeholder={field.label || field.name}
        />
      )}
    </div>
  )
}

// ───────────────────────────────────────────────────
// Collapsible section
// ───────────────────────────────────────────────────

function CollapsibleField({ field, value, onChange }: FieldProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="adm-collapsible">
      <button
        type="button"
        className="adm-collapsible__header"
        onClick={() => setOpen(!open)}
      >
        <span className="adm-collapsible__title">{field.label}</span>
        <span className={`adm-collapsible__chevron ${open ? 'adm-collapsible__chevron--open' : ''}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="adm-collapsible__body">
          {field.fields?.map(f => (
            <FormField key={f.name} field={f} value={value?.[f.name] ?? ''} onChange={onChange} />
          ))}
        </div>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────────
// Array field
// ───────────────────────────────────────────────────

function ArrayField({ field, value, onChange }: FieldProps) {
  const items: any[] = Array.isArray(value) ? value : []

  const addItem = () => {
    const newItem: Record<string, any> = {}
    field.fields?.forEach(f => { newItem[f.name] = f.defaultValue ?? '' })
    onChange(field.name, [...items, newItem])
  }

  const removeItem = (index: number) => {
    onChange(field.name, items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, fieldName: string, fieldValue: any) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      return { ...item, [fieldName]: fieldValue }
    })
    onChange(field.name, updated)
  }

  return (
    <div className="adm-field">
      <label className="adm-field__label">{field.label || field.name}</label>
      {field.description && <span className="adm-field__desc">{field.description}</span>}

      <div className="adm-array">
        {items.map((item, index) => (
          <div key={index} className="adm-array__item">
            <span className="adm-array__item-num">{index + 1}</span>
            <div className="adm-array__item-fields">
              {field.fields?.map(f => (
                <FormField
                  key={f.name}
                  field={{ ...f, label: f.label || f.name }}
                  value={item[f.name] ?? ''}
                  onChange={(name, val) => updateItem(index, name, val)}
                />
              ))}
            </div>
            <button
              type="button"
              className="adm-array__item-remove"
              onClick={() => removeItem(index)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="adm-array__add">
          <button type="button" className="adm-array__add-btn" onClick={addItem}>
            + Add {field.label || 'Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────
// Upload field (single file)
// ───────────────────────────────────────────────────

function UploadField({ field, value, onChange }: FieldProps) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // value can be an id (number/string) or a full object { id, url, filename }
  const mediaDoc = typeof value === 'object' && value !== null ? value : null
  const mediaId = mediaDoc?.id || (typeof value === 'number' || typeof value === 'string' ? value : null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await api.upload(file, '')
      onChange(field.name, result.doc.id)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(field.name, null)
  }

  return (
    <div className="adm-field">
      <label className="adm-field__label">{field.label || field.name}</label>
      {field.description && <span className="adm-field__desc">{field.description}</span>}

      {mediaDoc ? (
        <div className="adm-upload-preview">
          {mediaDoc.mimeType?.startsWith('image/') && mediaDoc.url && (
            <img className="adm-upload-preview__thumb" src={mediaDoc.url} alt={mediaDoc.alt || ''} />
          )}
          <div className="adm-upload-preview__info">
            <p className="adm-upload-preview__name">{mediaDoc.filename || `Media #${mediaDoc.id}`}</p>
            {mediaDoc.filesize && (
              <span className="adm-upload-preview__size">
                {(mediaDoc.filesize / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
          <button type="button" className="adm-upload-preview__remove" onClick={handleRemove}>✕</button>
        </div>
      ) : mediaId ? (
        <div className="adm-upload-preview">
          <div className="adm-upload-preview__info">
            <p className="adm-upload-preview__name">Media #{mediaId}</p>
          </div>
          <button type="button" className="adm-upload-preview__remove" onClick={handleRemove}>✕</button>
        </div>
      ) : (
        <div
          className="adm-upload-area"
          onClick={() => fileRef.current?.click()}
        >
          <div className="adm-upload-area__icon">{uploading ? '⏳' : '📁'}</div>
          <p className="adm-upload-area__text">
            {uploading ? 'Uploading...' : 'Click to upload'}
          </p>
          <p className="adm-upload-area__hint">or drag and drop</p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleUpload}
        accept={field.relationTo === 'media' ? 'image/*,application/pdf' : '*'}
      />
    </div>
  )
}

// ───────────────────────────────────────────────────
// Render a list of fields
// ───────────────────────────────────────────────────

type FieldListProps = {
  fields: FieldDef[]
  data: Record<string, any>
  onChange: (name: string, value: any) => void
}

export function FieldList({ fields, data, onChange }: FieldListProps) {
  return (
    <>
      {fields.map(field => {
        // For row fields, pass the whole data object so children can access their values
        if (field.type === 'row') {
          return <FormField key={field.name} field={field} value={data} onChange={onChange} />
        }
        // For collapsible, also pass whole data
        if (field.type === 'collapsible') {
          return <FormField key={field.name} field={field} value={data} onChange={onChange} />
        }
        return (
          <FormField
            key={field.name}
            field={field}
            value={data[field.name]}
            onChange={onChange}
          />
        )
      })}
    </>
  )
}
