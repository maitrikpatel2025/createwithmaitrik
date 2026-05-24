import { Button, ArrowRight, Eyebrow } from './ui/Button'
import { Reveal, RevealGroup } from './AnimateIn'

export function ServicesTeaser() {
  return (
    <section className="cwm-teaser">
      <div className="cwm-container cwm-teaser__grid">
        <Reveal animation="fade-up">
          <div>
            <Eyebrow>Work with me</Eyebrow>
            <h2 className="cwm-teaser__title">Hire the operator,<br />not the agency.</h2>
            <p className="cwm-teaser__desc">
              AI ad production, agent builds, and 1:1 coaching for creators. Direct line, no account-manager layer.
            </p>
            <Button href="/services" variant="primary" size="lg">
              Get my help <ArrowRight />
            </Button>
          </div>
        </Reveal>
        <RevealGroup stagger={100} animation="fade-up" className="cwm-feature-tiles">
          {[
            { num: '01', t: 'AI Ad Production', d: 'Cinematic ad creative without an agency.' },
            { num: '02', t: 'AI Agent Builds', d: 'Multi-agent systems that ship to production.' },
            { num: '03', t: 'Coaching', d: 'Reel formula + gen stack, 1:1.' },
            { num: '04', t: 'Spec Work', d: 'Concept-only briefs for brands I love.' },
          ].map((f) => (
            <div className="cwm-feature-tile" key={f.num}>
              <span className="cwm-feature-tile__num">{f.num}</span>
              <span className="cwm-feature-tile__title">{f.t}</span>
              <p className="cwm-feature-tile__desc">{f.d}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
