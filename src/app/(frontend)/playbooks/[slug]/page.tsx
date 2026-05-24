import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import type { PlaybookData } from '@/lib/payload'
import { Eyebrow } from '@/components/ui/Button'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Reveal, RevealGroup } from '@/components/AnimateIn'
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
        <Reveal animation="fade-in">
          <Link className="cwm-detail__back" href="/playbooks">
            ← All playbooks
          </Link>
        </Reveal>
        <RevealGroup stagger={80} animation="fade-up">
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
        </RevealGroup>

        <Reveal animation="fade-up">
          <MarkdownRenderer body={pb.body || ''} images={imageMap} />
        </Reveal>

        {pb.pdf?.url && (
          <Reveal animation="fade-up">
            <div className="cwm-pdf-download">
              <div className="cwm-pdf-download__icon">📄</div>
              <div className="cwm-pdf-download__text">
                <strong>Download this playbook as a PDF</strong>
                <span>Save it, print it, share it with your team.</span>
              </div>
              <a href={pb.pdf.url} download className="cwm-btn cwm-btn--primary">
                Download PDF →
              </a>
            </div>
          </Reveal>
        )}

        <Reveal animation="scale-up">
          <div className="cwm-bottom-cta">
            <h3>Want the full AI Ad Stack?</h3>
            <p>Get my 18-page operator guide with every tool, setting, and prompt I use — free.</p>
            <Link href="/#lead-magnet" className="cwm-btn cwm-btn--primary cwm-btn--lg" style={{ marginTop: 12 }}>
              Get the free AI Ad Stack →
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  )
}
