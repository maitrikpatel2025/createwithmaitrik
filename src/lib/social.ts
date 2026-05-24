export function socialUrl(platform: string, handle: string): string {
  const clean = handle.replace(/^@/, '')
  switch (platform) {
    case 'instagram': return `https://www.instagram.com/${clean}/`
    case 'youtube': return `https://www.youtube.com/${clean}`
    case 'tiktok': return `https://www.tiktok.com/@${clean}`
    case 'x': return `https://x.com/${clean}`
    case 'linkedin': return handle.startsWith('http') ? handle : `https://www.linkedin.com/${clean}/`
    default: return '#'
  }
}
