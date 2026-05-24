import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { notifyInquiry } from '@/lib/email'
import { upsertContact } from '@/lib/contacts'

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
        ...(serviceType ? { serviceType: String(serviceType) } : {}),
        ...(budget ? { budget: String(budget) } : {}),
        message: String(message).slice(0, 5000),
      },
    })

    // Send notification (non-blocking)
    notifyInquiry({
      name: String(name),
      email: String(email),
      serviceType: String(serviceType || ''),
      budget: String(budget || ''),
      message: String(message),
    }).catch((err) => console.error('[inquiry:notify]', err))

    // Log to CRM (non-blocking)
    upsertContact({
      email: String(email).toLowerCase(),
      name: String(name),
      source: 'inquiry',
      action: 'inquiry-submitted',
      detail: `${serviceType || 'General'} · ${budget || 'No budget'}`,
      tags: ['Hot Lead'],
      serviceInterest: serviceType ? [String(serviceType)] : [],
      budget: String(budget || ''),
    }).catch((err) => console.error('[inquiry:crm]', err))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[inquiry]', err)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
