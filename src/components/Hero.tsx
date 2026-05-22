import { Button, ArrowRight, Slash, Eyebrow } from './ui/Button'
import { SocialRow } from './SocialRow'
import type { SiteSettingsData } from '@/lib/payload'

export function Hero({ settings }: { settings: SiteSettingsData }) {
  const pillars = settings.pillars?.map((p) => p.label) || ['AI Ads', 'AI Agents', 'Built in Public']

  return (
    <section className="cwm-hero cwm-hero--split">
      <div className="cwm-container cwm-hero__split">
        <div>
          <span className="cwm-eyebrow-pill">
            <span className="dot" /> AI CREATOR &amp; EDUCATOR
          </span>
          <h1 className="cwm-hero__title" style={{ fontSize: 96, marginTop: 24 }}>
            Hey, I&apos;m<br />Maitrik<span className="accent">.</span>
          </h1>
          <div className="cwm-hero__pillars" style={{ marginTop: -8 }}>
            {pillars.map((p, i) => (
              <span key={p}>
                <span>{p}</span>
                {i < pillars.length - 1 && <span className="sep" style={{ margin: '0 0 0 18px' }}>/</span>}
              </span>
            ))}
          </div>
          <p className="cwm-hero__sub">
            {settings.statement} I share the prompts, the stacks, and the receipts — so you can ship the same kind of work without learning the hard way.
          </p>
          <div className="cwm-hero__ctas">
            <Button href="/#lead-magnet" variant="primary" size="lg">
              Get the free AI Ad Stack <ArrowRight />
            </Button>
            <Button href="/playbooks" variant="secondary" size="lg">
              Browse playbooks
            </Button>
          </div>
          <SocialRow settings={settings} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="cwm-hero__portrait">
            <span className="cwm-hero__portrait-slash">/</span>
            <span className="cwm-hero__portrait-label">Portrait · drop image here</span>
          </div>
        </div>
      </div>
    </section>
  )
}
