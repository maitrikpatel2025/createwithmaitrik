import { Reveal } from './AnimateIn'
import type { SiteSettingsData } from '@/lib/payload'

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const STATIC_STATS = [
  { value: '$2.3M', label: 'Saved via RPA bots' },
  { value: '47', label: 'AI tools tested' },
  { value: '6', label: 'Tools shipped' },
  { value: '4', label: 'Agents on cron' },
]

export function StatsBar({ settings }: { settings: SiteSettingsData }) {
  const stats: Array<{ value: string; label: string; live?: boolean }> = []

  if (settings.showIgFollowers && settings.igFollowers && settings.igFollowers > 0) {
    stats.push({ value: formatCount(settings.igFollowers), label: 'Instagram followers', live: true })
  }

  if (settings.showIgViews && settings.igViews && settings.igViews > 0) {
    stats.push({ value: formatCount(settings.igViews), label: 'Views (28 days)', live: true })
  }

  if (settings.showYtSubscribers && settings.ytSubscribers && settings.ytSubscribers > 0) {
    stats.push({ value: formatCount(settings.ytSubscribers), label: 'YouTube subscribers', live: true })
  }

  // Fill remaining slots with static stats (max 4 total)
  const remaining = Math.max(0, 4 - stats.length)
  for (let i = 0; i < remaining && i < STATIC_STATS.length; i++) {
    stats.push(STATIC_STATS[i])
  }

  return (
    <section className="cwm-stats-bar">
      <div className="cwm-container">
        <Reveal animation="fade-up">
          <div className="cwm-stats-bar__grid">
            {stats.map((s) => (
              <div key={s.label} className="cwm-stats-bar__item">
                <span className="cwm-stats-bar__value">
                  {s.value}
                  {s.live && <span className="cwm-stats-bar__live" title="Live counter" />}
                </span>
                <span className="cwm-stats-bar__label">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
