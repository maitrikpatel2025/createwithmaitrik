'use client'

import { useState } from 'react'

function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(children) } catch (_) {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="cwm-code">
      <div className="cwm-code__head">
        <span>{(lang || 'PROMPT').toUpperCase()}</span>
        <button className={`cwm-code__copy${copied ? ' is-copied' : ''}`} onClick={copy}>
          {copied ? 'COPIED ✓' : 'COPY'}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  )
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let s = text
  let key = 0
  const tokenRe = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`)/
  while (s.length) {
    const m = s.match(tokenRe)
    if (!m) { parts.push(s); break }
    if (m.index && m.index > 0) parts.push(s.slice(0, m.index))
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>)
    else if (m[3]) parts.push(<em key={key++}>{m[3]}</em>)
    else if (m[4]) parts.push(<a key={key++} href={m[5]} target="_blank" rel="noreferrer">{m[4]}</a>)
    else if (m[6]) parts.push(<code key={key++} style={{ background: 'var(--bg-2)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>{m[6]}</code>)
    s = s.slice((m.index ?? 0) + m[0].length)
  }
  return parts
}

type Block =
  | { type: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'quote'; content: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'code'; lang: string; content: string }
  | { type: 'image'; key: string }

function parseMarkdown(md: string): Block[] {
  const lines = md.split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    const fence = l.match(/^```(\w*)\s*$/)
    if (fence) {
      const lang = fence[1] || ''
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].match(/^```\s*$/)) { buf.push(lines[i]); i++ }
      i++
      blocks.push({ type: 'code', lang, content: buf.join('\n') })
      continue
    }
    const img = l.trim().match(/^\[IMAGE-(\d+)\]$/i)
    if (img) {
      blocks.push({ type: 'image', key: 'IMAGE-' + img[1] })
      i++; continue
    }
    const h = l.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      blocks.push({ type: ('h' + h[1].length) as 'h1' | 'h2' | 'h3' | 'h4', content: h[2] })
      i++; continue
    }
    if (l.startsWith('> ')) {
      const buf: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) { buf.push(lines[i].slice(2)); i++ }
      blocks.push({ type: 'quote', content: buf.join(' ') })
      continue
    }
    if (l.match(/^\d+\.\s+/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) { items.push(lines[i].replace(/^\d+\.\s+/, '')); i++ }
      blocks.push({ type: 'ol', items })
      continue
    }
    if (l.match(/^[-*]\s+/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) { items.push(lines[i].replace(/^[-*]\s+/, '')); i++ }
      blocks.push({ type: 'ul', items })
      continue
    }
    if (l.trim() === '') { i++; continue }
    const buf: string[] = [l]
    i++
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^(#{1,4}\s|```|>\s|\d+\.\s|[-*]\s|\[IMAGE-)/i)) {
      buf.push(lines[i]); i++
    }
    blocks.push({ type: 'p', content: buf.join(' ') })
  }
  return blocks
}

type ImageMap = Record<string, string>

export function MarkdownRenderer({
  body,
  images = {},
}: {
  body: string
  images?: ImageMap
}) {
  const blocks = parseMarkdown(body)
  return (
    <div className="cwm-prose">
      {blocks.map((b, idx) => {
        if (b.type === 'h1') return <h1 key={idx}>{renderInline(b.content)}</h1>
        if (b.type === 'h2') return <h2 key={idx}>{renderInline(b.content)}</h2>
        if (b.type === 'h3') return <h3 key={idx}>{renderInline(b.content)}</h3>
        if (b.type === 'h4') return <h4 key={idx}>{renderInline(b.content)}</h4>
        if (b.type === 'p') return <p key={idx}>{renderInline(b.content)}</p>
        if (b.type === 'ul') return <ul key={idx}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>
        if (b.type === 'ol') return <ol key={idx}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ol>
        if (b.type === 'quote') return <blockquote key={idx}>{renderInline(b.content)}</blockquote>
        if (b.type === 'code') return <CodeBlock key={idx} lang={b.lang}>{b.content}</CodeBlock>
        if (b.type === 'image') {
          const src = images[b.key]
          return (
            <div key={idx} className="cwm-prose__img">
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={b.key} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{b.key} · upload in dashboard to fill</span>
              )}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
