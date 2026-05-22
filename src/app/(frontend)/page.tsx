import { Hero } from '@/components/Hero'
import { LeadMagnetBand } from '@/components/LeadMagnetBand'
import { FeaturedPlaybooks } from '@/components/FeaturedPlaybooks'
import { NewsletterBand } from '@/components/NewsletterBand'
import { ToolStack } from '@/components/ToolStack'
import { ServicesTeaser } from '@/components/ServicesTeaser'
import { PartnershipsTeaser } from '@/components/PartnershipsTeaser'
import { getPayloadClient } from '@/lib/payload'
import type { SiteSettingsData, LeadMagnetData, PlaybookData, ToolData } from '@/lib/payload'

const DEFAULT_SETTINGS: SiteSettingsData = {
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
}

const DEFAULT_LM: LeadMagnetData = {
  title: 'The AI Ad Stack',
  blurb: 'The exact tools + character-sheet workflow I use to make agency-grade AI ads — free.',
  bullets: [
    { item: 'The 7-tool stack (with my exact settings)' },
    { item: 'Character-sheet workflow for consistent talent' },
    { item: 'Shot-list template + 6 working prompts' },
  ],
}

const DEFAULT_TOOLS: ToolData[] = [
  { id: 1, name: 'Nano Banana Pro', oneLiner: 'Image gen with character-consistent stills (via Freepik).', tag: 'AI Ads', order: 1 },
  { id: 2, name: 'Kling', oneLiner: 'Image- and text-to-video that holds character + motion.', tag: 'AI Ads', order: 2 },
  { id: 3, name: 'Seedance', oneLiner: 'Fast video gen for testing rough cuts before final render.', tag: 'AI Ads', order: 3 },
  { id: 4, name: 'Higgsfield', oneLiner: 'Camera moves and motion language without a real lens.', tag: 'AI Ads', order: 4 },
  { id: 5, name: 'DaVinci Resolve', oneLiner: 'Edit + color. Where every render goes to become an ad.', tag: 'Post', order: 5 },
  { id: 6, name: 'ElevenLabs', oneLiner: 'Voiceover that does not sound AI — if you tune it right.', tag: 'Audio', order: 6 },
  { id: 7, name: 'Claude Code', oneLiner: 'The agent + automation layer behind everything I ship.', tag: 'Agents', order: 7 },
]

async function getHomeData() {
  try {
    const payload = await getPayloadClient()
    const [settings, lm, playbooksRes, toolsRes] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'lead-magnet' }),
      payload.find({ collection: 'playbooks', where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] }, limit: 3 }),
      payload.find({ collection: 'tools', sort: 'order', limit: 20 }),
    ])
    return {
      settings: settings as unknown as SiteSettingsData,
      lm: lm as unknown as LeadMagnetData,
      playbooks: playbooksRes.docs as unknown as PlaybookData[],
      tools: toolsRes.docs as unknown as ToolData[],
    }
  } catch {
    return { settings: DEFAULT_SETTINGS, lm: DEFAULT_LM, playbooks: [], tools: DEFAULT_TOOLS }
  }
}

export default async function HomePage() {
  const { settings, lm, playbooks, tools } = await getHomeData()
  return (
    <>
      <Hero settings={settings} />
      <LeadMagnetBand lm={lm} />
      <FeaturedPlaybooks playbooks={playbooks} />
      <NewsletterBand />
      <ToolStack tools={tools.length > 0 ? tools : DEFAULT_TOOLS} />
      <ServicesTeaser />
      <PartnershipsTeaser settings={settings} />
    </>
  )
}
