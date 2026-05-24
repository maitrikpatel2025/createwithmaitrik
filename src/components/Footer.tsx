import Link from 'next/link'
import { Reveal } from './AnimateIn'
import type { SiteSettingsData } from '@/lib/payload'
import { socialUrl } from '@/lib/social'

export function Footer({ settings }: { settings: SiteSettingsData }) {
  const yr = settings.year || 2026
  const name = settings.name || 'Maitrik Patel'
  const domain = settings.domain || 'maitrikpatel.io'
  const stmt = settings.statement || 'Teaching myself AI so you can steal the playbook.'
  const location = settings.location || 'Brampton, Ontario, Canada'
  const helloEmail = settings.helloEmail || 'hello@maitrikpatel.io'
  const ig = settings.instagram || '@createwithmaitrik'
  const yt = settings.youtube || '@maitrikpatel'
  const li = settings.linkedin || 'in/maitrikpatel2025'

  return (
    <footer className="cwm-footer">
      <div className="cwm-container">
        <Reveal animation="fade-in">
          <div className="cwm-footer__top">
            <div className="cwm-footer__brand">
              <span className="cwm-footer__mark">/</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>
                  {name}
                </div>
                <div className="cwm-footer__tagline" style={{ marginTop: 6 }}>{stmt}</div>
                <div className="cwm-footer__tagline" style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' }}>
                  {location.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="cwm-footer__col">
              <h5>Library</h5>
              <Link href="/playbooks">All playbooks</Link>
              <Link href="/newsletter">Newsletter</Link>
              <Link href="/#lead-magnet">Free playbook</Link>
            </div>
            <div className="cwm-footer__col">
              <h5>Work with me</h5>
              <Link href="/services">Services</Link>
              <Link href="/partnerships">Partnerships</Link>
              <Link href="/about">About</Link>
            </div>
            <div className="cwm-footer__col">
              <h5>Connect</h5>
              <a href={socialUrl('instagram', ig)} target="_blank" rel="noreferrer">Instagram</a>
              <a href={socialUrl('youtube', yt)} target="_blank" rel="noreferrer">YouTube</a>
              <a href={socialUrl('linkedin', li)} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${helloEmail}`}>{helloEmail}</a>
            </div>
          </div>
        </Reveal>
        <div className="cwm-footer__bottom">
          <span>© {yr} {name.toUpperCase()} · {domain.toUpperCase()}</span>
          <span>BUILT IN PUBLIC <span style={{ fontFamily: 'var(--font-display)' }}>/</span> CLARITY OVER NOISE</span>
        </div>
      </div>
    </footer>
  )
}
