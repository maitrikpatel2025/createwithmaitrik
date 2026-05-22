import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import type { PlaybookData } from '@/lib/payload'
import { Slash, Eyebrow } from '@/components/ui/Button'
import { EmailCapture } from '@/components/EmailCapture'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import type { Metadata } from 'next'

async function getPlaybook(slug: string): Promise<PlaybookData | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'playbooks',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
      limit: 1,
    })
    return (res.docs[0] as unknown as PlaybookData) ?? null
  } catch {
    return null
  }
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const pb = await getPlaybook(slug)
  if (!pb) return {}
  return {
    title: pb.seoTitle || pb.title,
    description: pb.seoDescription || pb.summary,
  }
}

export default async function PlaybookDetailPage({ params }: Params) {
  const { slug } = await params
  const pb = await getPlaybook(slug)
  if (!pb) notFound()

  // Build image map from the images array
  const imageMap: Record<string, string> = {}
  pb.images?.forEach((img) => {
    if (img.placeholder && img.image?.url) {
      imageMap[img.placeholder] = img.image.url
    }
  })

  const publishedDate = pb.publishedDate
    ? new Date(pb.publishedDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <article className="cwm-detail">
      <div className="cwm-detail__container">
        <Link className="cwm-detail__back" href="/playbooks">
          ← All playbooks
        </Link>
        <div className="cwm-detail__meta">
          <span className="cwm-detail__tool">{pb.aiTool}</span>
          <span className="dot" />
          <span>{pb.topic}</span>
          <span className="dot" />
          <span>{pb.readTime}</span>
          <span className="dot" />
          <span>{publishedDate.toUpperCase()}</span>
        </div>
        <h1 className="cwm-detail__title">{pb.title}</h1>
        <p className="cwm-detail__sum">{pb.summary}</p>

        <div className="cwm-gate">
          <div className="cwm-gate__icon"><Slash size={24} /></div>
          <div className="cwm-gate__body">
            <h3 className="cwm-gate__title">Get the full guide as a PDF — free.</h3>
            <p className="cwm-gate__desc">
              Drop your email and I&apos;ll send you the offline-friendly PDF version of this playbook.
            </p>
            <EmailCapture size="sm" label="Get PDF" tag={`playbook-${pb.slug}`} />
          </div>
        </div>

        <MarkdownRenderer body={pb.body || ''} images={imageMap} />

        <div className="cwm-bottom-cta">
          <h3>Take it with you.</h3>
          <p>The PDF version is free — same content, formatted for offline reading.</p>
          <EmailCapture size="sm" label="Download Full PDF (Free)" tag={`playbook-${pb.slug}`} />
        </div>
      </div>
    </article>
  )
}
