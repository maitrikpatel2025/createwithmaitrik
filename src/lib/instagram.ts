/**
 * Instagram Graph API integration
 *
 * Setup:
 * 1. Create a Meta App at https://developers.facebook.com/
 * 2. Add "Instagram Graph API" product
 * 3. Connect your Instagram Business/Creator account
 * 4. Generate a long-lived access token (60 days)
 * 5. Add to .env:
 *    INSTAGRAM_ACCESS_TOKEN=your_token
 *    INSTAGRAM_USER_ID=your_ig_user_id
 *
 * The token must be refreshed before it expires (every 60 days).
 * Use the /api/instagram/refresh endpoint or set up a cron.
 */

export type InstagramStats = {
  followers: number
  mediaCount: number
  impressions: number | null
  reach: number | null
  profileViews: number | null
  fetchedAt: string
}

const FALLBACK_STATS: InstagramStats = {
  followers: 0,
  mediaCount: 0,
  impressions: null,
  reach: null,
  profileViews: null,
  fetchedAt: new Date().toISOString(),
}

// In-memory cache for server-side (survives across requests in the same process)
let cachedStats: InstagramStats | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export async function getInstagramStats(): Promise<InstagramStats> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!token || !userId) {
    return FALLBACK_STATS
  }

  // Return cached if fresh
  if (cachedStats && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedStats
  }

  try {
    // Fetch basic account info (followers, media count)
    const profileUrl = `https://graph.facebook.com/v21.0/${userId}?fields=followers_count,media_count,name&access_token=${token}`
    const profileRes = await fetch(profileUrl, { next: { revalidate: 3600 } })

    if (!profileRes.ok) {
      const errBody = await profileRes.text()
      console.error('[Instagram] Profile fetch failed:', profileRes.status, errBody)
      return cachedStats || FALLBACK_STATS
    }

    const profile = await profileRes.json()

    // Fetch insights (impressions, reach, profile_views) — last 28 days
    let impressions: number | null = null
    let reach: number | null = null
    let profileViews: number | null = null

    try {
      const insightsUrl = `https://graph.facebook.com/v21.0/${userId}/insights?metric=impressions,reach,profile_views&period=day&since=${Math.floor(Date.now() / 1000) - 28 * 86400}&until=${Math.floor(Date.now() / 1000)}&access_token=${token}`
      const insightsRes = await fetch(insightsUrl, { next: { revalidate: 3600 } })

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json()
        for (const metric of insightsData.data || []) {
          const total = (metric.values || []).reduce(
            (sum: number, v: { value: number }) => sum + (v.value || 0),
            0,
          )
          if (metric.name === 'impressions') impressions = total
          if (metric.name === 'reach') reach = total
          if (metric.name === 'profile_views') profileViews = total
        }
      }
    } catch (err) {
      // Insights may fail if the account doesn't have enough data yet
      console.error('[Instagram] Insights fetch failed (non-critical):', err)
    }

    const stats: InstagramStats = {
      followers: profile.followers_count || 0,
      mediaCount: profile.media_count || 0,
      impressions,
      reach,
      profileViews,
      fetchedAt: new Date().toISOString(),
    }

    cachedStats = stats
    cacheTimestamp = Date.now()

    return stats
  } catch (err) {
    console.error('[Instagram] Fetch error:', err)
    return cachedStats || FALLBACK_STATS
  }
}

/**
 * Format large numbers for display (e.g. 1234 → "1.2K", 12345 → "12.3K")
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}
