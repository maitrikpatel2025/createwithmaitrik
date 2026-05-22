'use client'

import { useState } from 'react'
import { Button, CheckCircle, ArrowRight } from './ui/Button'

interface EmailCaptureProps {
  placeholder?: string
  label?: string
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md'
  tag?: string
  pdfSlug?: string
}

export function EmailCapture({
  placeholder = 'you@domain.com',
  label = 'Get it →',
  theme = 'light',
  size = 'md',
  tag,
  pdfSlug,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tag, pdfSlug }),
      })
      setDone(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    if (theme === 'dark') {
      return (
        <div className="cwm-subscribe__success">
          <CheckCircle size={20} />
          <span>Sent. Check your inbox.</span>
        </div>
      )
    }
    return (
      <div className="cwm-lead__success">
        <CheckCircle size={20} />
        <span>Sent. Check your inbox for the link.</span>
      </div>
    )
  }

  if (theme === 'dark') {
    return (
      <form className="cwm-subscribe__form" onSubmit={submit}>
        <input
          className="cwm-subscribe__input"
          type="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? '...' : label}
        </Button>
      </form>
    )
  }

  if (size === 'sm') {
    return (
      <form className="cwm-gate__form" onSubmit={submit}>
        <input
          type="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? '...' : label}
        </Button>
        {error && <span style={{ color: 'red', fontSize: 12 }}>{error}</span>}
      </form>
    )
  }

  return (
    <form className="cwm-lead__form" onSubmit={submit}>
      <input
        className="cwm-lead__input"
        type="email"
        required
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="primary" size="lg" type="submit" disabled={loading}>
        {loading ? '...' : label} {!loading && <ArrowRight />}
      </Button>
      {error && <span style={{ color: 'red', fontSize: 12, marginTop: 6 }}>{error}</span>}
    </form>
  )
}
