import Link from 'next/link'
import { Eyebrow } from './ui/Button'
import { PlaybookCard } from './PlaybookCard'
import { Reveal, RevealGroup } from './AnimateIn'
import type { PlaybookData } from '@/lib/payload'

export function FeaturedPlaybooks({ playbooks }: { playbooks: PlaybookData[] }) {
  if (!playbooks || playbooks.length === 0) return null

  return (
    <section className="cwm-section">
      <div className="cwm-container">
        <Reveal animation="fade-up">
          <div className="cwm-section-head">
            <div className="cwm-section-head__l">
              <Eyebrow>Featured playbooks</Eyebrow>
              <h2 className="cwm-section-head__title">Steal the workflow.</h2>
            </div>
            <Link href="/playbooks" className="cwm-btn cwm-btn--tertiary">
              All playbooks →
            </Link>
          </div>
        </Reveal>
        <RevealGroup stagger={120} animation="fade-up" className="cwm-essays__grid">
          {playbooks.map((p) => <PlaybookCard key={p.id} playbook={p} />)}
        </RevealGroup>
      </div>
    </section>
  )
}
