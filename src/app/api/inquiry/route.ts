import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, serviceType, budget, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      data: {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        serviceType: String(serviceType || ''),
        budget: String(budget || ''),
        message: String(message).slice(0, 5000),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[inquiry]', err)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
