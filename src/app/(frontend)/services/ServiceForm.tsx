'use client'

import { useState } from 'react'
import { Button, ArrowRight, CheckCircle } from '@/components/ui/Button'

export function ServiceForm({ serviceNames }: { serviceNames: string[] }) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          serviceType: fd.get('serviceType'),
          budget: fd.get('budget'),
          message: fd.get('message'),
        }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div id="apply" className="cwm-form" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--cwm-blue)' }}>
          <CheckCircle />
          <span>Thanks. I&apos;ll reply within two business days.</span>
        </div>
      </div>
    )
  }

  return (
    <form id="apply" className="cwm-form" onSubmit={submit}>
      <div className="cwm-form__field">
        <label>Name</label>
        <input name="name" type="text" required placeholder="Your name" />
      </div>
      <div className="cwm-form__field">
        <label>Email</label>
        <input name="email" type="email" required placeholder="you@brand.com" />
      </div>
      <div className="cwm-form__field">
        <label>Service type</label>
        <select name="serviceType" required defaultValue="">
          <option value="" disabled>Pick one</option>
          {serviceNames.map((n) => <option key={n}>{n}</option>)}
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="cwm-form__field">
        <label>Budget range</label>
        <select name="budget" required defaultValue="">
          <option value="" disabled>Pick one</option>
          <option>&lt; $5k</option>
          <option>$5k – $15k</option>
          <option>$15k – $50k</option>
          <option>$50k+</option>
        </select>
      </div>
      <div className="cwm-form__field cwm-form__field--full">
        <label>Project description</label>
        <textarea name="message" required placeholder="What's the deliverable? What's the deadline? What does success look like?" />
      </div>
      <div className="cwm-form__submit">
        <Button variant="primary" size="lg" type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send inquiry'} {!loading && <ArrowRight />}
        </Button>
      </div>
    </form>
  )
}
