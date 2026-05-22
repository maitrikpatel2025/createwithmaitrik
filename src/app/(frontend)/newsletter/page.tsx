import { Eyebrow } from '@/components/ui/Button'
import { EmailCapture } from '@/components/EmailCapture'
import { getPayloadClient } from '@/lib/payload'
import type { NewsletterIssueData } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'The Playbook — one operator-grade workflow per week. Free.',
}

async function getIssues(): Promise<NewsletterIssueData[]> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'newsletter-issues',
      sort: '-date',
      limit: 50,
    })
    return res.docs as unknown as NewsletterIssueData[]
  } catch {
    return []
  }
}

export default async function NewsletterPage() {
  const issues = await getIssues()

  return (
    <>
      <div className="cwm-page-head">
        <div className="cwm-container">
          <Eyebrow>Newsletter archive</Eyebrow>
          <h1>The Playbook<span style={{ color: 'var(--cwm-blue)' }}>.</span></h1>
          <p className="cwm-page-head__sub">
            One playbook a week. The exact workflows that shipped, the prompts that worked, the misses. Free. Be one of the first.
          </p>
        </div>
      </div>

      <section className="cwm-section">
        <div className="cwm-container">
          <div className="cwm-newsletter-card">
            <div>
              <Eyebrow color="#A1A1A6">JOIN FREE</Eyebrow>
              <h2>The Sunday playbook<br />in your inbox.</h2>
              <p className="cwm-subscribe__sub">
                No filler. One operator-grade workflow you can copy that week.
              </p>
            </div>
            <div>
              <EmailCapture theme="dark" label="Join Free" tag="newsletter" />
              <p style={{ color: '#86868B', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em' }}>
                BE ONE OF THE FIRST · UNSUBSCRIBE ANYTIME
              </p>
            </div>
          </div>

          <Eyebrow>Past issues</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, letterSpacing: '-0.01em', margin: '12px 0 24px' }}>
            The archive.
          </h2>

          {issues.length === 0 ? (
            <div className="cwm-empty">
              No issues yet · the first one ships next Sunday · be one of the first
            </div>
          ) : (
            <div>
              {issues.map((it) => (
                <div className="cwm-issue" key={it.id}>
                  <span className="cwm-issue__num">{it.issueNumber || '—'}</span>
                  <div>
                    <h3 className="cwm-issue__title">{it.title}</h3>
                    <p className="cwm-issue__sum">{it.summary}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span className="cwm-issue__date">
                      {it.date ? new Date(it.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase() : ''}
                    </span>
                    {it.externalUrl && (
                      <a className="cwm-issue__link" href={it.externalUrl} target="_blank" rel="noreferrer">
                        Read issue →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
