import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getPayloadClient } from '@/lib/payload'
import type { SiteSettingsData } from '@/lib/payload'
import './animations.css'

export const metadata: Metadata = {
  title: {
    template: '%s · Maitrik Patel',
    default: 'Maitrik Patel · Steal the Playbook.',
  },
  description:
    'AI creator + educator. Practical playbooks for AI Ads, AI agents, and building in public.',
}

async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    return settings as unknown as SiteSettingsData
  } catch {
    return {
      name: 'Maitrik Patel',
      tagline: 'Steal the Playbook.',
      statement: 'Teaching myself AI so you can steal the playbook.',
      pillars: [{ label: 'AI Ads' }, { label: 'AI Agents' }, { label: 'Built in Public' }],
      location: 'Brampton, Ontario, Canada',
      year: 2026,
      domain: 'maitrikpatel.io',
      helloEmail: 'hello@maitrikpatel.io',
      partnershipsEmail: 'partnerships@maitrikpatel.io',
      instagram: '@createwithmaitrik',
      youtube: '@maitrikpatel',
      tiktok: '@maitrikpatel',
      x: '@maitrikpatel',
      linkedin: 'in/maitrikpatel',
    }
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
