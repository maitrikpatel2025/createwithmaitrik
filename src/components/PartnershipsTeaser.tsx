import { Button, ArrowRight, Eyebrow, Slash } from './ui/Button'
import type { SiteSettingsData } from '@/lib/payload'

export function PartnershipsTeaser({ settings }: { settings: SiteSettingsData }) {
  const partnershipsEmail = settings.partnershipsEmail || 'partnerships@maitrikpatel.io'

  return (
    <section className="cwm-teaser cwm-teaser--dark">
      <div className="cwm-container cwm-teaser__grid">
        <div>
          <Eyebrow color="#A1A1A6">Partnerships</Eyebrow>
          <h2 className="cwm-teaser__title" style={{ color: '#fff' }}>
            Bring me into<br />your campaign.
          </h2>
          <p className="cwm-teaser__desc">
            Sponsored video, link-in-bio, paid usage, newsletter features. Brand-safe voice, direct line.
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button href="/partnerships" variant="secondary" size="lg" style={{ background: '#fff', color: 'var(--fg-1)' }}>
              Work with me <ArrowRight />
            </Button>
            <a href={`mailto:${partnershipsEmail}`}
              style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', textDecoration: 'underline' }}>
              {partnershipsEmail}
            </a>
          </div>
        </div>
        <div style={{ position: 'relative', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 260, height: 240 }}>
            <div style={{ position: 'absolute', inset: 0, border: '1px solid #3A3A3C', borderRadius: 14, transform: 'rotate(-4deg)', background: '#2C2C2E' }} />
            <div style={{ position: 'absolute', inset: 0, border: '1px solid #3A3A3C', borderRadius: 14, transform: 'rotate(3deg)', background: '#1D1D1F' }} />
            <div style={{ position: 'absolute', inset: 12, border: '1px solid #3A3A3C', borderRadius: 14, background: '#2C2C2E', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: '#86868B' }}>MEDIA KIT · v1</span>
              <Slash size={64} color="#fff" />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.01em' }}>Maitrik Patel</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: '#86868B', marginTop: 4 }}>STEAL THE PLAYBOOK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
