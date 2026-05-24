import { Button, ArrowRight, Eyebrow, Slash } from './ui/Button'
import { Reveal } from './AnimateIn'
import type { SiteSettingsData } from '@/lib/payload'

export function PartnershipsTeaser({ settings }: { settings: SiteSettingsData }) {
  const partnershipsEmail = settings.partnershipsEmail || 'partnerships@maitrikpatel.io'

  return (
    <section className="cwm-teaser" style={{ background: 'var(--cwm-soft)' }}>
      <div className="cwm-container cwm-teaser__grid">
        <Reveal animation="fade-up">
          <div>
            <Eyebrow>Partnerships</Eyebrow>
            <h2 className="cwm-teaser__title">
              Bring me into<br />your campaign.
            </h2>
            <p className="cwm-teaser__desc" style={{ color: 'var(--fg-2)' }}>
              Sponsored video, link-in-bio, paid usage, newsletter features. Brand-safe voice, direct line.
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button href="/partnerships" variant="primary" size="lg">
                Work with me <ArrowRight />
              </Button>
              <a href={`mailto:${partnershipsEmail}`}
                style={{ color: 'var(--fg-2)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', textDecoration: 'underline' }}>
                {partnershipsEmail}
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal animation="scale-up" delay={200}>
          <div style={{ position: 'relative', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 260, height: 240 }}>
              <div className="anim-tilt" style={{ position: 'absolute', inset: 0, border: '1px solid var(--border-1)', borderRadius: 14, background: '#fff' }} />
              <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--border-1)', borderRadius: 14, transform: 'rotate(3deg)', background: 'var(--cwm-graphite)' }} />
              <div style={{ position: 'absolute', inset: 12, border: '1px solid #3A3A3C', borderRadius: 14, background: 'var(--cwm-graphite)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: '#A1A1A6' }}>MEDIA KIT · v1</span>
                <Slash size={64} color="#fff" />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.01em' }}>Maitrik Patel</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', color: '#A1A1A6', marginTop: 4 }}>STEAL THE PLAYBOOK</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
