import { Button, ArrowRight, Slash, Eyebrow, CheckCircle } from '@/components/ui/Button'
import { getPayloadClient } from '@/lib/payload'
import type { MediaKitStatData } from '@/lib/payload'

const DEFAULT_STATS: MediaKitStatData[] = [
  { value: '$2.3M', label: 'Saved via RPA bots in industry' },
  { value: '47', label: 'AI tools personally tested' },
  { value: '6', label: 'Tools shipped + live' },
  { value: '4', label: 'Agents running on cron' },
]

const AGE_BANDS = [
  { label: '18–24', pct: 18 },
  { label: '25–34', pct: 42 },
  { label: '35–44', pct: 27 },
  { label: '45+', pct: 13 },
]

const COUNTRIES = [
  { label: 'India', pct: 31 },
  { label: 'United States', pct: 24 },
  { label: 'Canada', pct: 14 },
  { label: 'UK', pct: 9 },
  { label: 'UAE', pct: 6 },
]

const CONCEPT_WORK = [
  { brand: 'Burberry', tag: 'Concept' },
  { brand: 'boAt', tag: 'Spec' },
  { brand: 'WestJet', tag: 'Concept' },
  { brand: 'Air Canada', tag: 'Spec' },
]

const BRAND_OFFERS = [
  { price: 'Sponsored', title: 'Sponsored video', desc: 'One integrated sponsorship in a short-form reel or long-form YouTube — clearly labeled, on-brand voice.' },
  { price: 'Link-in-bio', title: 'Link-in-bio placement', desc: 'Featured slot in the link-in-bio for a campaign window. Direct UTM tracking.' },
  { price: 'Paid usage', title: 'Paid usage / whitelisting', desc: 'Run my organic content as a paid ad on your handles. Standard 60-day window.' },
  { price: 'Newsletter', title: 'Newsletter feature', desc: 'A dedicated slot in The Playbook — copywritten in-house, not a banner.' },
]

const WHY_BRANDS = [
  'Direct-to-builder voice — no agency layer.',
  'Hands-on with every render, prompt, and edit.',
  'Brand-safe — no shock content, no chased trends.',
  'Tracking + reporting back inside 7 days.',
  'Hindi/English fluency — built-in dual market.',
  'AI Ads I would actually ship for a paid client.',
]

async function getStats(): Promise<MediaKitStatData[]> {
  try {
    const payload = await getPayloadClient()
    const mk = await payload.findGlobal({ slug: 'media-kit-stats' }) as any
    return mk.stats || DEFAULT_STATS
  } catch {
    return DEFAULT_STATS
  }
}

export default async function PartnershipsPage() {
  const stats = await getStats()
  const partnershipsEmail = 'partnerships@maitrikpatel.io'

  return (
    <>
      <div className="cwm-page-head">
        <div className="cwm-container">
          <Eyebrow>Media kit · Partnerships</Eyebrow>
          <h1>For brands that<br />want to be in the work.</h1>
          <p className="cwm-page-head__sub">
            I work with a small number of brands a year. Direct-to-builder voice, no agency layer, and a deliverable you&apos;d be proud to ship.
          </p>
          <div className="cwm-page-head__ctas">
            <Button href={`mailto:${partnershipsEmail}`} variant="primary" size="lg">
              Email partnerships <ArrowRight />
            </Button>
            <Button variant="secondary" size="lg">Download media kit (PDF)</Button>
          </div>
        </div>
      </div>

      <section className="cwm-section">
        <div className="cwm-container">
          <Eyebrow>Proof of work</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            Receipts, not reach.
            <span className="cwm-pending-pill"><span className="dot" /> audience numbers pending</span>
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.55, maxWidth: 720, margin: '12px 0 0' }}>
            The brand is new — but the work isn&apos;t. These are the receipts that matter when there&apos;s no follower count to wave around yet.
          </p>
          <div className="cwm-stat-grid">
            {stats.map((s, i) => (
              <div className="cwm-stat" key={i}>
                <div className="cwm-stat__value">{s.value}</div>
                <div className="cwm-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="cwm-demographics">
            <div>
              <Eyebrow>Audience · age</Eyebrow>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.01em', margin: '8px 0 24px' }}>
                Who&apos;s reading.
                <span className="cwm-pending-pill"><span className="dot" /> fill once analytics exist</span>
              </h3>
              <div className="cwm-bar-list">
                {AGE_BANDS.map((b) => (
                  <div className="cwm-bar" key={b.label}>
                    <span className="cwm-bar__label">{b.label}</span>
                    <div className="cwm-bar__track">
                      <div className="cwm-bar__fill" style={{ width: `${b.pct}%`, opacity: 0.35 }} />
                    </div>
                    <span className="cwm-bar__value" style={{ opacity: 0.5 }}>{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow>Top countries</Eyebrow>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.01em', margin: '8px 0 24px' }}>
                Where they are.
              </h3>
              <div className="cwm-bar-list">
                {COUNTRIES.map((b) => (
                  <div className="cwm-bar" key={b.label}>
                    <span className="cwm-bar__label">{b.label}</span>
                    <div className="cwm-bar__track">
                      <div className="cwm-bar__fill" style={{ width: `${b.pct * 2.4}%`, opacity: 0.35 }} />
                    </div>
                    <span className="cwm-bar__value" style={{ opacity: 0.5 }}>{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Eyebrow>Concept work</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 0' }}>
            Spec ads I&apos;ve made for brands I love.
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.55, maxWidth: 720, margin: '12px 0 0' }}>
            These are concept / spec — not paid work. Yet.
            {/* swap for real client logos once they exist */}
          </p>
          <div className="cwm-concept-grid">
            {CONCEPT_WORK.map((c) => (
              <div className="cwm-concept" key={c.brand}>
                <span className="cwm-concept__slash">/</span>
                <span className="cwm-concept__brand">{c.brand}</span>
                <span className="cwm-concept__tag">{c.tag}</span>
              </div>
            ))}
          </div>

          <Eyebrow>What I offer</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 0' }}>
            Four ways to work together.
          </h2>
          <div className="cwm-offer-list">
            {BRAND_OFFERS.map((o) => (
              <div className="cwm-offer" key={o.title}>
                <span className="cwm-offer__price">{o.price}</span>
                <h3 className="cwm-offer__title">{o.title}</h3>
                <p className="cwm-offer__desc">{o.desc}</p>
              </div>
            ))}
          </div>

          <Eyebrow>Why brands work with me</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 0' }}>
            Six things you&apos;ll get.
          </h2>
          <ul className="cwm-checklist">
            {WHY_BRANDS.map((w) => (
              <li key={w}><CheckCircle size={20} /> {w}</li>
            ))}
          </ul>

          <div className="cwm-bottom-cta" style={{ margin: '32px 0 0' }}>
            <Slash size={48} style={{ color: 'var(--cwm-blue)' }} />
            <h3 style={{ marginTop: 12 }}>Let&apos;s talk.</h3>
            <p>Send the brief — I&apos;ll reply within two business days.</p>
            <a href={`mailto:${partnershipsEmail}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 22px', background: 'var(--cwm-blue)', color: '#fff', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
              {partnershipsEmail} <ArrowRight />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
