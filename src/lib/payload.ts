import { getPayload } from 'payload'
import config from '@payload-config'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}

// Type helpers for common data shapes
export type SiteSettingsData = {
  name?: string
  tagline?: string
  statement?: string
  pillars?: Array<{ label: string; id?: string }>
  location?: string
  year?: number
  domain?: string
  helloEmail?: string
  partnershipsEmail?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  x?: string
  linkedin?: string
}

export type LeadMagnetData = {
  title?: string
  blurb?: string
  bullets?: Array<{ item: string; id?: string }>
  pdf?: { url?: string; filename?: string } | null
  emailFormId?: string
}

export type PaidOfferData = {
  title?: string
  blurb?: string
  price?: string
  checkoutUrl?: string
}

export type PlaybookData = {
  id: string | number
  title: string
  slug: string
  summary?: string
  body?: string
  aiTool?: string
  topic?: string
  readTime?: string
  publishedDate?: string
  featured?: boolean
  status?: string
  seoTitle?: string
  seoDescription?: string
  images?: Array<{
    placeholder?: string
    image?: { url?: string; alt?: string }
    id?: string
  }>
  pdf?: { url?: string } | null
}

export type ToolData = {
  id: string | number
  name: string
  oneLiner?: string
  affiliateUrl?: string
  tag?: string
  order?: number
}

export type ServiceData = {
  id: string | number
  title: string
  description?: string
  deliverables?: Array<{ item: string; id?: string }>
  order?: number
}

export type NewsletterIssueData = {
  id: string | number
  title: string
  summary?: string
  date?: string
  externalUrl?: string
  issueNumber?: string
}

export type MediaKitStatData = {
  value: string
  label: string
  id?: string
}
