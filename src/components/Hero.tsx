import Image from 'next/image'
import { Button, ArrowRight, Slash, Eyebrow } from './ui/Button'
import { SocialRow } from './SocialRow'
import { Reveal, RevealGroup } from './AnimateIn'
import type { SiteSettingsData } from '@/lib/payload'

export function Hero({ settings }: { settings: SiteSettingsData }) {
  return (
    <section className="cwm-hero cwm-hero--split">
      <div className="cwm-container cwm-hero__split">
        <RevealGroup stagger={120} animation="fade-up">
          <span className="cwm-eyebrow-pill">
            <span className="dot" /> AI ADS · AI AGENTS · BUILT IN PUBLIC
          </span>
          <h1 className="cwm-hero__title" style={{ marginTop: 24 }}>
            I build with AI<span className="accent">.</span>
          </h1>
          <p className="cwm-hero__subtitle">
            Ads. Workflows. Agents. All in public.
          </p>
          <p className="cwm-hero__sub" style={{ fontSize: 19, lineHeight: 1.55 }}>
            From spec ads to OpenClaw&apos;s multi-agent research system — I ship AI tools and share every prompt, stack, and receipt so you can do the same.
          </p>
          <div className="cwm-hero__ctas">
            <Button href="/#lead-magnet" variant="primary" size="lg">
              Get the free AI Ad Stack <ArrowRight />
            </Button>
            <Button href="/playbooks" variant="tertiary" size="lg">
              Browse playbooks →
            </Button>
          </div>
          <SocialRow settings={settings} />
        </RevealGroup>
        <Reveal animation="scale-up" delay={500}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="cwm-hero__portrait cwm-hero__portrait--has-img">
              <Image
                src="/assets/maitrik-portrait.png"
                alt="Maitrik Patel"
                fill
                sizes="(max-width: 900px) 280px, 360px"
                priority
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
