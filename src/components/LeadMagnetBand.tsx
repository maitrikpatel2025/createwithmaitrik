import { Slash, Eyebrow, CheckCircle } from './ui/Button'
import { EmailCapture } from './EmailCapture'
import type { LeadMagnetData } from '@/lib/payload'

function PdfCover({ title }: { title: string }) {
  return (
    <div className="cwm-pdf">
      <div className="cwm-pdf__shadow" />
      <div className="cwm-pdf__page">
        <span className="cwm-pdf__eyebrow">PLAYBOOK · v1.0</span>
        <Slash size={64} style={{ marginTop: 18 }} />
        <h4 className="cwm-pdf__title">{title}</h4>
        <span className="cwm-pdf__sub">Free · 18-page operator guide</span>
        <div className="cwm-pdf__bar" />
        <span className="cwm-pdf__foot">MAITRIK PATEL</span>
      </div>
    </div>
  )
}

export function LeadMagnetBand({ lm }: { lm: LeadMagnetData }) {
  const title = lm.title || 'The AI Ad Stack'
  const blurb = lm.blurb || 'The exact tools + character-sheet workflow I use to make agency-grade AI ads — free.'
  const bullets = lm.bullets?.map((b) => b.item) || [
    'The 7-tool stack (with my exact settings)',
    'Character-sheet workflow for consistent talent',
    'Shot-list template + 6 working prompts',
  ]

  return (
    <section className="cwm-lead" id="lead-magnet">
      <div className="cwm-container">
        <div className="cwm-lead__card">
          <div className="cwm-lead__art">
            <PdfCover title={title} />
          </div>
          <div className="cwm-lead__body">
            <Eyebrow>Free · Lead magnet</Eyebrow>
            <h2 className="cwm-lead__title">
              {title}<span className="accent">.</span>
            </h2>
            <p className="cwm-lead__desc">{blurb}</p>
            <ul className="cwm-lead__list">
              {bullets.map((b) => (
                <li key={b}>
                  <CheckCircle size={18} /> {b}
                </li>
              ))}
            </ul>
            <EmailCapture label="Send it to me" tag="lead-magnet" />
            <p className="cwm-lead__caption" style={{ marginTop: 12 }}>
              BE ONE OF THE FIRST · NO SPAM · UNSUBSCRIBE ANYTIME
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
