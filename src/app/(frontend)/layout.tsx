import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getPayloadClient } from '@/lib/payload'
import type { SiteSettingsData } from '@/lib/payload'

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
    <>
      <Nav settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  )
}
