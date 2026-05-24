/**
 * Shared afterChange hooks for all CRM collections.
 * Fires webhooks, logs activity, and runs automations.
 * All operations are non-blocking and errors never crash the parent operation.
 */

import { fireWebhooks } from './webhooks'
import { logActivity, getActor } from './activityLog'

/**
 * Generic afterChange hook — attach to any collection.
 * Handles: activity logging, webhook dispatch.
 * Wrapped in try/catch so hook errors never crash the API response.
 */
export function createAfterChangeHook(eventMap: {
  created?: string
  updated?: string
  stageChanged?: string
  statusChanged?: string
  won?: string
  paid?: string
  completed?: string
}) {
  return async ({ doc, previousDoc, req, operation, collection }: any) => {
    try {
      const actor = getActor(req)
      const slug = collection?.slug || 'unknown'

      if (operation === 'create') {
        logActivity({
          action: 'create',
          collection: slug,
          docId: doc.id,
          actor,
          summary: `${slug} created: ${doc.title || doc.name || doc.email || doc.invoiceNumber || doc.id}`,
        }).catch((err) => console.error('[hook:activity]', err))

        if (eventMap.created) {
          fireWebhooks(eventMap.created, { collection: slug, doc }).catch((err) =>
            console.error('[hook:webhook]', err),
          )
        }
      }

      if (operation === 'update') {
        // Stage change detection (deals)
        if (eventMap.stageChanged && previousDoc?.stage && doc.stage !== previousDoc.stage) {
          logActivity({
            action: 'stage-change',
            collection: slug,
            docId: doc.id,
            actor,
            summary: `${doc.title || doc.id} moved from ${previousDoc.stage} to ${doc.stage}`,
            details: { from: previousDoc.stage, to: doc.stage },
          }).catch((err) => console.error('[hook:activity]', err))

          fireWebhooks(eventMap.stageChanged, {
            collection: slug,
            doc,
            previousStage: previousDoc.stage,
            newStage: doc.stage,
          }).catch((err) => console.error('[hook:webhook]', err))

          if (eventMap.won && doc.stage === 'Won') {
            fireWebhooks(eventMap.won, { collection: slug, doc }).catch((err) =>
              console.error('[hook:webhook]', err),
            )
          }
        }

        // Status change detection (invoices, tasks)
        if (eventMap.statusChanged && previousDoc?.status && doc.status !== previousDoc.status) {
          logActivity({
            action: 'status-change',
            collection: slug,
            docId: doc.id,
            actor,
            summary: `${doc.title || doc.invoiceNumber || doc.id} status: ${previousDoc.status} → ${doc.status}`,
            details: { from: previousDoc.status, to: doc.status },
          }).catch((err) => console.error('[hook:activity]', err))

          if (eventMap.paid && doc.status === 'paid') {
            fireWebhooks(eventMap.paid, { collection: slug, doc }).catch((err) =>
              console.error('[hook:webhook]', err),
            )
          }

          if (eventMap.completed && doc.status === 'done') {
            fireWebhooks(eventMap.completed, { collection: slug, doc }).catch((err) =>
              console.error('[hook:webhook]', err),
            )
          }
        }

        // Generic update
        if (
          eventMap.updated &&
          !(eventMap.stageChanged && previousDoc?.stage && doc.stage !== previousDoc.stage) &&
          !(eventMap.statusChanged && previousDoc?.status && doc.status !== previousDoc.status)
        ) {
          logActivity({
            action: 'update',
            collection: slug,
            docId: doc.id,
            actor,
            summary: `${slug} updated: ${doc.title || doc.name || doc.email || doc.invoiceNumber || doc.id}`,
          }).catch((err) => console.error('[hook:activity]', err))
        }
      }
    } catch (err) {
      // Never crash the parent operation
      console.error('[collectionHooks:afterChange]', err)
    }

    return doc
  }
}
