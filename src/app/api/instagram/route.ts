import { NextResponse } from 'next/server'
import { getInstagramStats } from '@/lib/instagram'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  try {
    const stats = await getInstagramStats()
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    })
  } catch (err) {
    console.error('[API /instagram] Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram stats' },
      { status: 500 },
    )
  }
}
