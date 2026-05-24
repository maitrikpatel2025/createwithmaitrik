import Image from 'next/image'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import type { SiteSettingsData } from '@/lib/payload'
import { socialUrl } from '@/lib/social'

export const metadata: Metadata = {
  title: 'Links · Maitrik Patel',
  description: 'All my links in one place. AI ads, playbooks, newsletter, and more.',
}

// ── Icons ──────────────────────────────────────────────────
function IcoIG() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>) }
function IcoYT() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 6 3-6 3z" fill="currentColor" stroke="none"/></svg>) }
function IcoTT() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4a4 4 0 0 0 4 4"/></svg>) }
function IcoX()  { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l18 18M21 3 3 21"/></svg>) }
function IcoIn() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 1 1 4 0v4M12 17v-7"/></svg>) }
function IcoMail() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 6 10-6"/></svg>) }
function IcoArrow() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17 17 7M7 7h10v10"/></svg>) }

// ── Types ──────────────────────────────────────────────────
type BioLink = {
  title: string
  desc?: string
  href: string
  emoji?: string
  highlight?: boolean
  enabled?: boolean
  id?: string
}

type LinkInBioData = {
  tagline?: string
  links?: BioLink[]
}

// ── Default links (fallback when CMS is empty) ─────────────
const DEFAULT_LINKS: BioLink[] = [
  { title: 'Get the free AI Ad Stack', desc: '18-page guide with every tool, setting, and prompt', href: '/#lead-magnet', emoji: '📄', highlight: true, enabled: true },
  { title: 'Browse all playbooks', desc: 'Real workflows — AI ads, agents, built in public', href: '/playbooks', emoji: '📚', enabled: true },
  { title: 'Subscribe to The Playbook', desc: 'Weekly operator-grade workflows, free', href: '/newsletter', emoji: '✉️', enabled: true },
  { title: 'Work with me', desc: 'AI ad production, agent builds, coaching', href: '/services', emoji: '🤝', enabled: true },
  { title: 'Brand partnerships', desc: 'Sponsored content, paid usage, newsletter features', href: '/partnerships', emoji: '💼', enabled: true },
  { title: 'About me', desc: 'The operator story — from RPA to AI agents', href: '/about', emoji: '👋', enabled: true },
]

// ── Data fetching ──────────────────────────────────────────
async function getData() {
  try {
    const payload = await getPayloadClient()
    const [settings, bioData] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'link-in-bio' }),
    ])
    return {
      settings: settings as unknown as SiteSettingsData,
      bio: bioData as unknown as LinkInBioData,
    }
  } catch {
    return {
      settings: {
        name: 'Maitrik Patel',
        instagram: '@createwithmaitrik',
        youtube: '@maitrikpatel',
        tiktok: '@maitrikpatel',
        x: '@maitrikpatel',
        linkedin: 'in/maitrikpatel2025',
        helloEmail: 'hello@maitrikpatel.io',
      } as SiteSettingsData,
      bio: { tagline: '', links: [] } as LinkInBioData,
    }
  }
}

export default async function LinksPage() {
  const { settings, bio } = await getData()

  const tagline = bio.tagline || 'I build with AI. Ads. Workflows. Agents. All in public.'
  const links = (bio.links && bio.links.length > 0)
    ? bio.links.filter((l) => l.enabled !== false)
    : DEFAULT_LINKS

  const socials = [
    { icon: <IcoIG />, href: socialUrl('instagram', settings.instagram || 'createwithmaitrik'), label: 'Instagram' },
    { icon: <IcoYT />, href: socialUrl('youtube', settings.youtube || '@maitrikpatel'), label: 'YouTube' },
    { icon: <IcoTT />, href: socialUrl('tiktok', settings.tiktok || '@maitrikpatel'), label: 'TikTok' },
    { icon: <IcoX />,  href: socialUrl('x', settings.x || '@maitrikpatel'), label: 'X' },
    { icon: <IcoIn />, href: socialUrl('linkedin', settings.linkedin || 'in/maitrikpatel2025'), label: 'LinkedIn' },
    { icon: <IcoMail />, href: `mailto:${settings.helloEmail || 'hello@maitrikpatel.io'}`, label: 'Email' },
  ]

  return (
    <div className="bio">
      <div className="bio__container">
        {/* Profile */}
        <div className="bio__profile">
          <div className="bio__avatar">
            <Image
              src="/assets/maitrik-portrait.png"
              alt={settings.name || 'Maitrik Patel'}
              fill
              sizes="96px"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              priority
            />
          </div>
          <h1 className="bio__name">{settings.name || 'Maitrik Patel'}</h1>
          <p className="bio__tagline">{tagline}</p>
        </div>

        {/* Social icons */}
        <div className="bio__socials">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="bio__social" aria-label={s.label}>
              {s.icon}
            </a>
          ))}
        </div>

        {/* Link cards */}
        <div className="bio__links">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className={`bio__card${link.highlight ? ' bio__card--highlight' : ''}`}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className="bio__card-emoji">{link.emoji || '🔗'}</span>
              <div className="bio__card-text">
                <span className="bio__card-title">{link.title}</span>
                {link.desc && <span className="bio__card-desc">{link.desc}</span>}
              </div>
              <IcoArrow />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="bio__footer">
          <span className="bio__footer-slash">/</span>
          <span>createwithmaitrik</span>
        </div>
      </div>
    </div>
  )
}
