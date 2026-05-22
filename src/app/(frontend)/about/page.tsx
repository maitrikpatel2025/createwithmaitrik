import Link from 'next/link'
import { Button, ArrowRight, Eyebrow } from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'From RPA bots to AI ads — the running record of a builder working in public.',
}

const TIMELINE = [
  {
    year: '~2020',
    title: 'Started in RPA.',
    body: [
      'First real exposure to "the machine does the work" — RPA bots running back-office processes at scale.',
      'By the end of the run those bots were delivering $2.3M in annual savings with 95% accuracy gains. The lesson: a small piece of software, in the right loop, beats a team.',
    ],
  },
  {
    year: '2024',
    title: 'Incorporated Flowbotics Inc.',
    body: [
      'Set up the business vehicle before there was a product — because if the work was going to be real, the wrapper needed to be real.',
      'No website, no marketing. Just a name and the receipts to prove it could move.',
    ],
  },
  {
    year: '2024',
    title: 'AI Product Owner at Nestlé.',
    body: [
      'Enterprise-grade data pipelines, Snowflake, early agentic experiments inside a Fortune 50 environment.',
      'The crash course in what "production" actually means at scale — and where AI breaks when the load is not synthetic.',
    ],
  },
  {
    year: '2025',
    title: 'Cracked AI image gen.',
    body: [
      'The Freepik + Nano Banana Pro workflow. Character-agnostic stills that hold across an entire ad spot without redraws.',
      'The first time the output felt agency-grade. Everything since runs off this stack.',
    ],
  },
  {
    year: '2025',
    title: 'Launched Create with Maitrik.',
    body: [
      'Built the Instagram handle as a public lab — and locked the Hinglish reel formula (16 hooks, one rhythm).',
      'The audience builds the playbook, and the playbook builds the audience.',
    ],
  },
  {
    year: '2025',
    title: 'Built my own agents.',
    body: [
      'OpenClaw — a multi-agent setup that handles research, writes drafts, and keeps Cortex (my private knowledge base) fresh on a cron.',
      'The agents do the boring half so I can spend cycles on the cinematic half.',
    ],
  },
  {
    year: '2026',
    title: 'Shipped Event Image Forge.',
    body: [
      'An AI prompt tool covering 57 occasions, live on GitHub Pages. One weekend, all the way to shipped.',
      'A reminder that the fastest distance between idea and proof is a static site and a working prompt.',
    ],
  },
  {
    year: '2026',
    title: 'Going deep on AI ads.',
    body: [
      'Pursuing agency-grade spec ads — Burberry, boAt, WestJet, Air Canada concept work.',
      'In parallel: working toward CCA-F. The plan is to be the operator agencies hire once the work compounds.',
    ],
  },
]

export default function AboutPage() {
  return (
    <>
      <div className="cwm-page-head">
        <div className="cwm-container">
          <Eyebrow>About</Eyebrow>
          <h1>Operator first.<br />Creator second.</h1>
          <p className="cwm-page-head__sub">
            I spent five years deploying RPA bots inside enterprise before I started shipping AI ads on the open internet. This site is the running record.
          </p>
        </div>
      </div>

      <section className="cwm-section">
        <div className="cwm-container" style={{ maxWidth: 880 }}>
          <div className="cwm-timeline">
            {TIMELINE.map((m, i) => (
              <div className="cwm-milestone" key={i}>
                <span className="cwm-milestone__date">{m.year}</span>
                <span className="cwm-milestone__dot" />
                <div className="cwm-milestone__body">
                  <h3 className="cwm-milestone__title">{m.title}</h3>
                  {m.body.map((para, j) => <p key={j}>{para}</p>)}
                </div>
              </div>
            ))}
          </div>

          <div className="cwm-personal">
            <Eyebrow>Off-screen</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.01em', margin: '12px 0 16px' }}>
              The rest of it.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.65, color: 'var(--fg-1)', margin: '0 0 14px' }}>
              When I&apos;m not in the stack, I&apos;m on the mat — jujutsu, three times a week. The rest of the time I&apos;m reading Vedic frameworks and looking for the place they overlap with systems thinking.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.65, color: 'var(--fg-1)', margin: 0 }}>
              I live in Brampton, Ontario, Canada. Most of the work happens between 6am and noon, in front of one screen, with the door closed.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '0 0 96px' }}>
            <Button href="/playbooks" variant="primary" size="lg">Read the playbooks <ArrowRight /></Button>
            <Button href="/services" variant="secondary" size="lg">Work with me</Button>
            <Button href="/partnerships" variant="tertiary" size="lg">Partnerships →</Button>
          </div>
        </div>
      </section>
    </>
  )
}
