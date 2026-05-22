import { NextRequest, NextResponse } from 'next/server'
import { subscribeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, tag } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    await subscribeEmail({ email: email.trim().toLowerCase(), tag })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
