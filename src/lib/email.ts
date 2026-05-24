/**
 * Email adapter
 * - Beehiiv for newsletter/lead-magnet subscriptions
 * - SMTP (nodemailer) for service inquiry notifications
 *
 * Required env vars:
 *   BEEHIIV_API_KEY        — API key from beehiiv.com/settings/integrations
 *   BEEHIIV_PUBLICATION_ID — starts with "pub_..."
 *
 *   SMTP_HOST              — e.g. smtp.gmail.com
 *   SMTP_PORT              — e.g. 587
 *   SMTP_USER              — your email
 *   SMTP_PASS              — app password (not your login password)
 *   SMTP_FROM              — sender address (e.g. noreply@maitrikpatel.io)
 *   INQUIRY_NOTIFY_EMAIL   — where inquiry emails are sent (e.g. hello@maitrikpatel.io)
 */

import nodemailer from 'nodemailer'

// ── SMTP transporter (lazy init) ──────────────────────────────────
let _transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (_transporter) return _transporter
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
  return _transporter
}

// ── Newsletter / lead-magnet subscription via Beehiiv ─────────────
export type SubscribeParams = {
  email: string
  tag?: string
  formId?: string
}

export async function subscribeEmail(params: SubscribeParams): Promise<void> {
  const { email, tag } = params
  const apiKey = process.env.BEEHIIV_API_KEY
  const pubId = process.env.BEEHIIV_PUBLICATION_ID

  if (!apiKey || !pubId) {
    console.log(`[email:stub] subscribe ${email} tag=${tag ?? 'none'}`)
    return
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'website',
        utm_medium: tag || 'organic',
        custom_fields: tag ? [{ name: 'Source', value: tag }] : [],
      }),
    },
  )

  if (!res.ok) {
    const body = await res.text()
    console.error(`[beehiiv] ${res.status} — ${body}`)
    throw new Error(`Beehiiv subscription failed: ${res.status}`)
  }
}

// ── Service inquiry notification via SMTP ─────────────────────────
export type InquiryNotifyParams = {
  name: string
  email: string
  serviceType?: string
  budget?: string
  message: string
}

export async function notifyInquiry(params: InquiryNotifyParams): Promise<void> {
  const transporter = getTransporter()
  const notifyEmail = process.env.INQUIRY_NOTIFY_EMAIL

  if (!transporter || !notifyEmail) {
    console.log(`[inquiry:stub] from=${params.email} name=${params.name}`)
    return
  }

  const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || ''

  await transporter.sendMail({
    from: `"Create with Maitrik" <${fromAddr}>`,
    to: notifyEmail,
    replyTo: params.email,
    subject: `🔔 New inquiry from ${params.name}`,
    text: [
      `Name: ${params.name}`,
      `Email: ${params.email}`,
      `Service: ${params.serviceType || '—'}`,
      `Budget: ${params.budget || '—'}`,
      '',
      `Message:`,
      params.message,
      '',
      `---`,
      `Sent from createwithmaitrik.com at ${new Date().toISOString()}`,
    ].join('\n'),
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="font-size: 20px; margin-bottom: 16px;">New Service Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${params.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${params.email}">${params.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Service</td><td style="padding: 8px 0;">${params.serviceType || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Budget</td><td style="padding: 8px 0;">${params.budget || '—'}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f5f5f7; border-radius: 10px;">
          <p style="margin: 0; white-space: pre-wrap;">${params.message}</p>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">
          Sent from createwithmaitrik.com · ${new Date().toISOString()}
        </p>
      </div>
    `,
  })
}
