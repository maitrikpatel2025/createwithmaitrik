import { getPayloadClient } from './payload'

export type LogActivityParams = {
  action: 'create' | 'update' | 'delete' | 'stage-change' | 'status-change' | 'login' | 'api-call' | 'webhook-fired' | 'automation-ran' | 'custom'
  collection: string
  docId?: string | number
  actor?: string
  summary: string
  details?: Record<string, unknown>
  ip?: string
}

/**
 * Log an entry to the global activity log.
 * Non-blocking — errors are caught and logged, never thrown.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'activity-log',
      data: {
        action: params.action,
        collection: params.collection,
        docId: params.docId ? String(params.docId) : undefined,
        actor: params.actor || 'system',
        summary: params.summary,
        details: params.details || undefined,
        ip: params.ip || undefined,
      },
    })
  } catch (err) {
    console.error('[activityLog]', err)
  }
}

/**
 * Helper to extract actor from a Payload request.
 * Returns user email, API key label, or "anonymous".
 */
export function getActor(req: any): string {
  if (req?.user?.email) return req.user.email
  if (req?.headers?.get?.('authorization')?.startsWith('Bearer cwm_')) return 'api-key'
  return 'anonymous'
}
