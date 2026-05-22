import { getPayloadClient } from '@/lib/payload'
import type { PlaybookData } from '@/lib/payload'
import { PlaybooksClient } from './PlaybooksClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Playbooks',
  description: "Every workflow I've shipped. Real prompts, real tools, real receipts.",
}

async function getPlaybooks(): Promise<PlaybookData[]> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'playbooks',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 100,
    })
    return res.docs as unknown as PlaybookData[]
  } catch {
    return []
  }
}

export default async function PlaybooksPage() {
  const playbooks = await getPlaybooks()
  return <PlaybooksClient initialPlaybooks={playbooks} />
}
