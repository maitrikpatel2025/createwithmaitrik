import { Eyebrow } from './ui/Button'
import { EmailCapture } from './EmailCapture'

export function NewsletterBand() {
  return (
    <section className="cwm-subscribe">
      <div className="cwm-container">
        <div className="cwm-subscribe__inner">
          <div>
            <Eyebrow color="#A1A1A6">The Playbook · Weekly</Eyebrow>
            <h2 className="cwm-subscribe__title">Learn.<br />Apply.<br />Compound.</h2>
            <p className="cwm-subscribe__sub">
              One playbook a week. The exact workflows that shipped, the prompts that worked, the misses. Free.
            </p>
          </div>
          <div>
            <EmailCapture theme="dark" label="Join Free" tag="newsletter" />
            <p style={{ color: '#86868B', marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em' }}>
              BE ONE OF THE FIRST · THE PLAYBOOK · WEEKLY · FREE
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
