import Link from 'next/link'
import type { PlaybookData } from '@/lib/payload'

const TOPIC_COVERS: Record<string, string> = {
  'AI Ads': 'linear-gradient(135deg, #E3F0FF 0%, #B3D4FC 50%, #0071E3 100%)',
  'AI Agents': 'linear-gradient(135deg, #F0F0F2 0%, #8E8E93 50%, #1D1D1F 100%)',
  'Built in Public': 'linear-gradient(135deg, #E0F5EC 0%, #7DD3A8 50%, #30D158 100%)',
}
const DEFAULT_COVER = 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 50%, #D2D2D7 100%)'

export function PlaybookCard({ playbook }: { playbook: PlaybookData }) {
  return (
    <Link href={`/playbooks/${playbook.slug}`} className="cwm-essay" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="cwm-essay__cover" style={{ background: TOPIC_COVERS[playbook.topic || ''] || DEFAULT_COVER }}>
        <span className="cwm-essay__cover-slash">/</span>
        <span className="cwm-essay__cover-tool">{playbook.aiTool}</span>
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
