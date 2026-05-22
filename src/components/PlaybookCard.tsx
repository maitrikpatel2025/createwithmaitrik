import Link from 'next/link'
import type { PlaybookData } from '@/lib/payload'

export function PlaybookCard({ playbook }: { playbook: PlaybookData }) {
  return (
    <Link href={`/playbooks/${playbook.slug}`} className="cwm-essay" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="cwm-essay__cover">
        <span className="cwm-essay__cover-slash">/</span>
        <div className="cwm-essay__cover-mono" />
      </div>
      <div className="cwm-essay__meta">
        <span className="cwm-essay__tool">{playbook.aiTool}</span>
        <span className="dot" />
        <span>{playbook.topic}</span>
        <span className="dot" />
        <span>{playbook.readTime}</span>
      </div>
      <h3 className="cwm-essay__title">{playbook.title}</h3>
      <p className="cwm-essay__desc">{playbook.summary}</p>
    </Link>
  )
}
