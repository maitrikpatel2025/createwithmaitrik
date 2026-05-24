import type { SiteSettingsData } from '@/lib/payload'
import { socialUrl } from '@/lib/social'

function IcoIG() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>) }
function IcoYT() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 6 3-6 3z" fill="currentColor" stroke="none"/></svg>) }
function IcoTT() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4a4 4 0 0 0 4 4"/></svg>) }
function IcoX()  { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l18 18M21 3 3 21"/></svg>) }
function IcoIn() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 1 1 4 0v4M12 17v-7"/></svg>) }

export function SocialRow({ settings, inverse }: { settings: SiteSettingsData; inverse?: boolean }) {
  const items = [
    { icon: <IcoIG />, handle: settings.instagram || 'createwithmaitrik', platform: 'instagram', name: 'Instagram' },
    { icon: <IcoYT />, handle: settings.youtube || '@maitrikpatel', platform: 'youtube', name: 'YouTube' },
    { icon: <IcoTT />, handle: settings.tiktok || '@maitrikpatel', platform: 'tiktok', name: 'TikTok' },
    { icon: <IcoX />,  handle: settings.x || '@maitrikpatel', platform: 'x', name: 'X' },
    { icon: <IcoIn />, handle: settings.linkedin || 'in/maitrikpatel2025', platform: 'linkedin', name: 'LinkedIn' },
  ]
  return (
    <div className="cwm-social-row" style={inverse ? { '--border-1': '#3A3A3C' } as React.CSSProperties : undefined}>
      {items.map((it) => (
        <a key={it.name} href={socialUrl(it.platform, it.handle)} target="_blank" rel="noopener noreferrer" aria-label={it.name}
          style={inverse ? { background: '#2C2C2E', borderColor: '#3A3A3C', color: '#fff' } : undefined}>
          {it.icon}
        </a>
      ))}
    </div>
  )
}
