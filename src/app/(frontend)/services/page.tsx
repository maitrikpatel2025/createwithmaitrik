'use client'

import { useState } from 'react'
import { Button, ArrowRight, Slash, Eyebrow, CheckCircle } from '@/components/ui/Button'
import { EmailCapture } from '@/components/EmailCapture'

const SERVICES = [
  {
    id: 1, order: 1, title: 'AI Ad Production',
    description: 'For founders and brands who want cinematic ad creative without an agency budget — concept, generation, edit, voiceover, finished asset.',
    deliverables: ['Concept + script', 'Image generation', 'Video generation', 'Edit + voiceover'],
  },
  {
    id: 2, order: 2, title: 'AI Agent & Automation Builds',
    description: 'For businesses with repetitive ops. We map the workflow, pick the right model, and ship agents that actually run in production.',
    deliverables: ['Agent architecture', 'Multi-agent setup', 'Scheduled automations', 'Knowledge base'],
  },
  {
    id: 3, order: 3, title: 'Built-in-Public Coaching',
    description: 'For creators who want the workflow. The reel formula, the gen stack, the systems — broken down on a 1:1.',
    deliverables: ['Reel formula', 'Gen stack', 'Systems teardown', '1:1 review'],
  },
]

function ServiceForm() {
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
          <option>AI Ad Production</option>
          <option>AI Agent &amp; Automation Builds</option>
          <option>Built-in-Public Coaching</option>
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

export default function ServicesPage() {
  return (
    <>
      <div className="cwm-page-head">
        <div className="cwm-container">
          <Eyebrow>Services · Apply only</Eyebrow>
          <h1>Hire the operator.<br />Skip the agency.</h1>
          <p className="cwm-page-head__sub">
            Selective intake. I take on a handful of projects at a time so each one ships at the level I&apos;d want my own name on.
          </p>
          <div className="cwm-page-head__ctas">
            <a href="#apply" className="cwm-btn cwm-btn--primary cwm-btn--lg">
              Apply now <ArrowRight />
            </a>
          </div>
        </div>
      </div>

      <section className="cwm-section">
        <div className="cwm-container">
          <div className="cwm-paid-banner">
            <div>
              <span className="cwm-paid-banner__price">PAID OFFER · WAITLIST OPEN</span>
              <h2 className="cwm-paid-banner__title">
                The AI Ad Playbook<span style={{ color: 'var(--cwm-blue)' }}>.</span>
              </h2>
              <p style={{ color: '#A1A1A6', fontSize: 16, lineHeight: 1.55, margin: 0, maxWidth: 520 }}>
                My full spec-ad process, packaged. From brief to deliverable, every prompt, every tool, every edit decision.
              </p>
            </div>
            <div className="cwm-paid-banner__cta">
              <Button variant="secondary" size="lg" style={{ background: '#fff' }}>
                Join the waitlist <ArrowRight />
              </Button>
            </div>
          </div>

          <Eyebrow>The three doors</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', lineHeight: 1.1, margin: '12px 0 8px' }}>
            What I take on.
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 17, lineHeight: 1.55, maxWidth: 640, margin: 0 }}>
            Three lanes. Each one runs my own stack — the same one in the playbooks. No subcontractors. No layers.
          </p>

          <div className="cwm-services-grid">
            {SERVICES.map((s) => (
              <div className="cwm-service-card" key={s.id}>
                <span className="cwm-tag">0{s.order}</span>
                <h3 className="cwm-service-card__title">{s.title}</h3>
                <p className="cwm-service-card__desc">{s.description}</p>
                <ul className="cwm-service-card__list">
                  {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="cwm-testimonial">
            <Slash size={36} style={{ color: 'var(--cwm-blue)', marginBottom: 16 }} />
            <blockquote className="cwm-testimonial__quote">
              We shipped a 30-second spec ad in a long weekend that looked like a five-figure agency cut. The brief-to-render loop is unreal.
            </blockquote>
            <div className="cwm-testimonial__attr">
              <span className="cwm-testimonial__avatar">A</span>
              <div>
                <div style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Aman Verma</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em' }}>Founder · LaneOne Coffee</div>
              </div>
            </div>
          </div>

          <Eyebrow>The fit test</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 8px' }}>
            Who this is for.
          </h2>
          <div className="cwm-fit">
            <div className="cwm-fit__col">
              <div className="cwm-fit__head">
                <span className="cwm-fit__check"><CheckCircle size={16} /></span>
                <span className="cwm-fit__title">Best fit for</span>
              </div>
              <ul className="cwm-fit__list">
                <li>Founders shipping fast and willing to be in the loop.</li>
                <li>Brands who want cinematic AI ads without an agency wrapper.</li>
                <li>Ops teams losing 10+ hours a week to repetitive workflows.</li>
                <li>Creators who want my exact reel formula and gen stack.</li>
              </ul>
            </div>
            <div className="cwm-fit__col">
              <div className="cwm-fit__head">
                <span className="cwm-fit__check cwm-fit__check--no">×</span>
                <span className="cwm-fit__title">Not a good fit</span>
              </div>
              <ul className="cwm-fit__list">
                <li>You want a hands-off agency relationship with PMs in between.</li>
                <li>You need 30+ deliverables a month at scale.</li>
                <li>You&apos;re allergic to seeing the workflow (this is built in public).</li>
                <li>The budget is &ldquo;we&apos;ll see how the first one goes.&rdquo;</li>
              </ul>
            </div>
          </div>

          <Eyebrow>Apply</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 8px' }}>
            Tell me about the project.
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.55, maxWidth: 640, margin: 0 }}>
            Short form. Two business days to reply. Inquiries go straight to my inbox.
          </p>
          <ServiceForm />
        </div>
      </section>
    </>
  )
}
