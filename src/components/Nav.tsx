'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Slash, Button } from './ui/Button'
import type { SiteSettingsData } from '@/lib/payload'

const NAV_LINKS = [
  { href: '/playbooks', label: 'Playbooks' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/services', label: 'Services' },
  { href: '/partnerships', label: 'Partnerships' },
  { href: '/about', label: 'About' },
]

export function Nav({ settings }: { settings: SiteSettingsData }) {
  const pathname = usePathname()

  return (
    <nav className="cwm-nav">
      <div className="cwm-nav__inner">
        <Link className="cwm-nav__brand" href="/">
          <Slash size={22} />
          <span className="cwm-nav__name">{settings.name || 'Maitrik Patel'}</span>
        </Link>
        <div className="cwm-nav__links">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cwm-nav__link${isActive ? ' is-active' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
        <div className="cwm-nav__cta">
          <Button href="/#lead-magnet" size="sm" variant="primary">
            Free playbook →
          </Button>
        </div>
      </div>
    </nav>
  )
}
