import { Button, ArrowRight, Slash, Eyebrow, CheckCircle } from '@/components/ui/Button'
import { Reveal, RevealGroup } from '@/components/AnimateIn'
import { getPayloadClient } from '@/lib/payload'
import type { ServiceData, PaidOfferData } from '@/lib/payload'
import { ServiceForm } from './ServiceForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Selective intake. AI ad production, agent builds, and coaching — direct from the operator.',
}

const DEFAULT_SERVICES: ServiceData[] = [
  { id: 1, title: 'AI Ad Production', description: 'For founders and brands who want cinematic ad creative without an agency budget — concept, generation, edit, voiceover, finished asset.', deliverables: [{ item: 'Concept + script' }, { item: 'Image generation' }, { item: 'Video generation' }, { item: 'Edit + voiceover' }], order: 1 },
  { id: 2, title: 'AI Agent & Automation Builds', description: 'For businesses with repetitive ops. We map the workflow, pick the right model, and ship agents that actually run in production.', deliverables: [{ item: 'Agent architecture' }, { item: 'Multi-agent setup' }, { item: 'Scheduled automations' }, { item: 'Knowledge base' }], order: 2 },
  { id: 3, title: 'Built-in-Public Coaching', description: 'For creators who want the workflow. The reel formula, the gen stack, the systems — broken down on a 1:1.', deliverables: [{ item: 'Reel formula' }, { item: 'Gen stack' }, { item: 'Systems teardown' }, { item: '1:1 review' }], order: 3 },
]

const DEFAULT_OFFER: PaidOfferData = {
  title: 'The AI Ad Playbook',
  blurb: 'My full spec-ad process, packaged. From brief to deliverable, every prompt, every tool, every edit decision.',
  price: 'Coming soon · waitlist',
  checkoutUrl: '',
}

async function getServices(): Promise<ServiceData[]> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'services', sort: 'order', limit: 20 })
    const docs = res.docs as unknown as ServiceData[]
    return docs.length > 0 ? docs : DEFAULT_SERVICES
  } catch {
    return DEFAULT_SERVICES
  }
}

async function getPaidOffer(): Promise<PaidOfferData> {
  try {
    const payload = await getPayloadClient()
    const offer = await payload.findGlobal({ slug: 'paid-offer' }) as unknown as PaidOfferData
    return offer?.title ? offer : DEFAULT_OFFER
  } catch {
    return DEFAULT_OFFER
  }
}

export default async function ServicesPage() {
  const [services, offer] = await Promise.all([getServices(), getPaidOffer()])
  const serviceNames = services.map((s) => s.title)

  return (
    <>
      <div className="cwm-page-head">
        <div className="cwm-container">
          <RevealGroup stagger={100} animation="fade-up">
            <Eyebrow>Services · Apply only</Eyebrow>
            <h1>Hire the operator.<br />Skip the agency.</h1>
            <p className="cwm-page-head__sub">
              Selective intake. I take on a handful of projects at a time so each one ships at the level I&apos;d want my own name on.
            </p>
            <div className="cwm-page-head__ctas">
              <a href="#apply" className="cwm-btn cwm-btn--primary cwm-btn--lg">
                Start a conversation <ArrowRight />
              </a>
            </div>
          </RevealGroup>
        </div>
      </div>

      <section className="cwm-section">
        <div className="cwm-container">
          <Reveal animation="fade-up">
            <div className="cwm-paid-banner">
              <div>
                <span className="cwm-paid-banner__price">PAID OFFER · WAITLIST OPEN</span>
                <h2 className="cwm-paid-banner__title">
                  {offer.title}<span style={{ color: 'var(--cwm-blue)' }}>.</span>
                </h2>
                <p style={{ color: '#A1A1A6', fontSize: 16, lineHeight: 1.55, margin: 0, maxWidth: 520 }}>
                  {offer.blurb}
                </p>
              </div>
              <div className="cwm-paid-banner__cta">
                <Button
                  variant="secondary"
                  size="lg"
                  style={{ background: '#fff' }}
                  href={offer.checkoutUrl || undefined}
                >
                  Join the waitlist <ArrowRight />
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal animation="fade-up">
            <div>
              <Eyebrow>The three doors</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', lineHeight: 1.1, margin: '12px 0 8px' }}>
                What I take on.
              </h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 17, lineHeight: 1.55, maxWidth: 640, margin: 0 }}>
                Three lanes. Each one runs my own stack — the same one in the playbooks. No subcontractors. No layers.
              </p>
            </div>
          </Reveal>

          <RevealGroup stagger={120} animation="fade-up" className="cwm-services-grid">
            {services.map((s, i) => (
              <div className="cwm-service-card" key={s.id}>
                <span className="cwm-tag">0{(s.order ?? i + 1)}</span>
                <h3 className="cwm-service-card__title">{s.title}</h3>
                <p className="cwm-service-card__desc">{s.description}</p>
                <ul className="cwm-service-card__list">
                  {(s.deliverables || []).map((d) => <li key={d.item}>{d.item}</li>)}
                </ul>
              </div>
            ))}
          </RevealGroup>

          <Reveal animation="fade-up">
            <div className="cwm-testimonial">
              <Slash size={36} style={{ color: 'var(--cwm-blue)', marginBottom: 16 }} />
              <blockquote className="cwm-testimonial__quote">
                We shipped a 30-second spec ad in a long weekend that looked like a five-figure agency cut. The brief-to-render loop is unreal.
              </blockquote>
              <div className="cwm-testimonial__attr">
                <span className="cwm-testimonial__avatar">A</span>
                <div>
                  <div style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Aman Verma</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' }}>Founder · LaneOne Coffee</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal animation="fade-up">
            <div>
              <Eyebrow>The fit test</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 8px' }}>
                Who this is for.
              </h2>
            </div>
          </Reveal>
          <RevealGroup stagger={150} animation="fade-up" className="cwm-fit">
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
          </RevealGroup>

          <Reveal animation="fade-up">
            <div>
              <Eyebrow>Start here</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 8px' }}>
                Tell me about the project.
              </h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.55, maxWidth: 640, margin: 0 }}>
                Short form, no commitment. I reply within two business days — straight to your inbox.
              </p>
            </div>
          </Reveal>
          <Reveal animation="fade-up">
            <ServiceForm serviceNames={serviceNames} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
