import { NextRequest, NextResponse } from 'next/server'
import { subscribeEmail } from '@/lib/email'
import { upsertContact } from '@/lib/contacts'

export async function POST(req: NextRequest) {
  try {
    const { email, tag } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    await subscribeEmail({ email: cleanEmail, tag })

    // Log to CRM (non-blocking)
    upsertContact({
      email: cleanEmail,
      source: tag === 'lead-magnet' ? 'lead-magnet' : 'newsletter',
      action: 'subscribed',
      detail: tag || 'newsletter',
      tags: tag === 'lead-magnet' ? ['Lead Magnet'] : ['Newsletter'],
    }).catch((err) => console.error('[subscribe:crm]', err))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
