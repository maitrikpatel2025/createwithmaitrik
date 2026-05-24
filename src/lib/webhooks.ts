import crypto from 'crypto'
import { getPayloadClient } from './payload'

/**
 * Fire all active webhooks registered for a given event.
 * Called from collection afterChange hooks.
 */
export async function fireWebhooks(
  event: string,
  payload_data: Record<string, unknown>,
): Promise<void> {
  try {
    const payload = await getPayloadClient()

    const webhooks = await payload.find({
      collection: 'webhooks',
      where: {
        active: { equals: true },
      },
      limit: 100,
    })

    const matching = webhooks.docs.filter((hook: any) =>
      (hook.event || []).includes(event),
    )

    for (const hook of matching as any[]) {
      // Fire each webhook in parallel, non-blocking
      deliverWebhook(hook, event, payload_data, payload).catch((err) =>
        console.error(`[webhook:${hook.label}]`, err),
      )
    }
  } catch (err) {
    console.error('[webhooks:fire]', err)
  }
}

async function deliverWebhook(
  hook: any,
  event: string,
  data: Record<string, unknown>,
  payload: any,
): Promise<void> {
  const body = JSON.stringify({ event, data, timestamp: new Date().toISOString() })

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-CWM-Event': event,
  }

  // HMAC signature
  if (hook.secret) {
    const signature = crypto
      .createHmac('sha256', hook.secret)
      .update(body)
      .digest('hex')
    headers['X-CWM-Signature'] = signature
  }

  // Custom headers
  if (hook.headers?.length) {
    for (const h of hook.headers) {
      if (h.key && h.value) headers[h.key] = h.value
    }
  }

  try {
    const resp = await fetch(hook.url, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(10000),
    })

    await payload.update({
      collection: 'webhooks',
      id: hook.id,
      data: {
        lastTriggeredAt: new Date().toISOString(),
        lastStatus: resp.status,
        failCount: resp.ok ? 0 : (hook.failCount || 0) + 1,
      },
    })
  } catch (err) {
    console.error(`[webhook:deliver:${hook.label}]`, err)
    await payload.update({
      collection: 'webhooks',
      id: hook.id,
      data: {
        lastTriggeredAt: new Date().toISOString(),
        lastStatus: 0,
        failCount: (hook.failCount || 0) + 1,
      },
    }).catch(() => {})
  }
}
