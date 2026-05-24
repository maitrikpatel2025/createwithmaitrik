import { Eyebrow } from './ui/Button'
import { Reveal, RevealGroup } from './AnimateIn'
import type { ToolData } from '@/lib/payload'

export function ToolStack({ tools }: { tools: ToolData[] }) {
  return (
    <section className="cwm-section cwm-section--soft">
      <div className="cwm-container">
        <Reveal animation="fade-up">
          <div className="cwm-section-head">
            <div className="cwm-section-head__l">
              <Eyebrow>The stack</Eyebrow>
              <h2 className="cwm-section-head__title">The tools I actually use.</h2>
            </div>
            <span className="cwm-disclosure">Some links are affiliate · same price for you</span>
          </div>
        </Reveal>
        <RevealGroup stagger={80} animation="fade-up" className="cwm-stack__grid">
          {tools.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).map((t) => {
            const inner = (
              <>
                <div className="cwm-stack__top">
                  <span className="cwm-stack__name">{t.name}</span>
                  <span className="cwm-stack__tag">{t.tag}</span>
                </div>
                <p className="cwm-stack__use">{t.oneLiner}</p>
                {t.affiliateUrl && (
                  <span className="cwm-stack__link">Try it →</span>
                )}
              </>
            )

            return t.affiliateUrl ? (
              <a
                key={t.id}
                className="cwm-stack__card"
                href={t.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <div key={t.id} className="cwm-stack__card">
                {inner}
              </div>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
