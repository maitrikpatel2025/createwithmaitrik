'use client'

import { useState, useMemo } from 'react'
import { Eyebrow } from '@/components/ui/Button'
import { PlaybookCard } from '@/components/PlaybookCard'
import type { PlaybookData } from '@/lib/payload'

const TOOL_FILTERS = ['All', 'Midjourney', 'Claude', 'ChatGPT', 'Runway', 'Freepik', 'ElevenLabs', 'Multi-Tool']
const TOPIC_FILTERS = ['All', 'AI Ads', 'AI Agents', 'Built in Public']

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`cwm-chip${active ? ' is-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export function PlaybooksClient({ initialPlaybooks }: { initialPlaybooks: PlaybookData[] }) {
  const [tool, setTool] = useState('All')
  const [topic, setTopic] = useState('All')

  const list = useMemo(
    () =>
      initialPlaybooks.filter(
        (p) =>
          (tool === 'All' || p.aiTool === tool) &&
          (topic === 'All' || p.topic === topic),
      ),
    [initialPlaybooks, tool, topic],
  )

  return (
    <>
      <div className="cwm-page-head">
        <div className="cwm-container">
          <Eyebrow>The Library</Eyebrow>
          <h1>Every playbook.<br />Every tool.</h1>
          <p className="cwm-page-head__sub">
            Every workflow I&apos;ve shipped. Real prompts, real tools, real receipts. Free to read, paid to skip the hard parts.
          </p>
        </div>
      </div>

      <section className="cwm-section">
        <div className="cwm-container">
          <div className="cwm-filter-row">
            <span className="cwm-filter-row__label">By AI tool</span>
            {TOOL_FILTERS.map((t) => (
              <Chip key={t} active={tool === t} onClick={() => setTool(t)}>{t}</Chip>
            ))}
          </div>
          <div className="cwm-filter-row">
            <span className="cwm-filter-row__label">By topic</span>
            {TOPIC_FILTERS.map((t) => (
              <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>{t}</Chip>
            ))}
          </div>

          <div className="cwm-result-count">
            Showing {list.length} {list.length === 1 ? 'playbook' : 'playbooks'}
            {(tool !== 'All' || topic !== 'All') && (
              <button
                onClick={() => { setTool('All'); setTopic('All') }}
                style={{ marginLeft: 14, background: 'transparent', border: 'none', color: 'var(--cwm-blue)', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', cursor: 'pointer' }}
              >
                CLEAR FILTERS
              </button>
            )}
          </div>

          {list.length > 0 ? (
            <div className="cwm-essays__grid">
              {list.map((p) => <PlaybookCard key={p.id} playbook={p} />)}
            </div>
          ) : (
            <div className="cwm-empty">No playbooks match. Clear a filter to see more.</div>
          )}
        </div>
      </section>
    </>
  )
}
