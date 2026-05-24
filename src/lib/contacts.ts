/**
 * Contact CRM helper — upserts a contact on every email interaction.
 * Merges data so a newsletter subscriber who later sends an inquiry
 * ends up as one unified contact with full activity history.
 */

import { getPayloadClient } from './payload'

export type UpsertContactParams = {
  email: string
  name?: string
  source: 'newsletter' | 'lead-magnet' | 'inquiry' | 'partnership' | 'manual' | 'api'
  action: string          // e.g. 'subscribed', 'inquiry-submitted', 'pdf-download'
  detail?: string         // e.g. 'AI Ad Production, $5k–$15k'
  tags?: string[]
  serviceInterest?: string[]
  budget?: string
  company?: string
}

export async function upsertContact(params: UpsertContactParams): Promise<void> {
  try {
    const payload = await getPayloadClient()

    const activityEntry = {
      action: params.action,
      detail: params.detail || '',
      timestamp: new Date().toISOString(),
    }

    // Check if contact exists
    const existing = await payload.find({
      collection: 'contacts',
      where: { email: { equals: params.email.toLowerCase() } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update existing — append activity, merge tags
      const doc = existing.docs[0] as any
      const existingActivity = doc.activity || []
      const existingTags = doc.tags || []
      const mergedTags = [...new Set([...existingTags, ...(params.tags || [])])]

      const updateData: Record<string, unknown> = {
        activity: [...existingActivity, activityEntry],
        tags: mergedTags,
      }

      // Fill in name if we didn't have it
      if (params.name && !doc.name) {
        updateData.name = params.name
      }

      // Upgrade status: lead → subscriber if they subscribe
      if (doc.status === 'lead' && (params.source === 'newsletter' || params.source === 'lead-magnet')) {
        updateData.status = 'subscriber'
      }
      // Upgrade status: lead/subscriber → prospect if they inquire
      if ((doc.status === 'lead' || doc.status === 'subscriber') && params.source === 'inquiry') {
        updateData.status = 'prospect'
      }

      // Merge service interest + budget from inquiry
      if (params.serviceInterest) {
        const existingInterest = doc.serviceInterest || []
        updateData.serviceInterest = [...new Set([...existingInterest, ...params.serviceInterest])]
      }
      if (params.budget && !doc.budget) {
        updateData.budget = params.budget
      }
      if (params.company && !doc.company) {
        updateData.company = params.company
      }

      await payload.update({
        collection: 'contacts',
        id: doc.id,
        data: updateData,
      })
    } else {
      // Create new contact
      await payload.create({
        collection: 'contacts',
        data: {
          email: params.email.toLowerCase(),
          name: params.name || '',
          source: params.source,
          status: params.source === 'inquiry' ? 'prospect' : 'lead',
          tags: params.tags || [],
          activity: [activityEntry],
          serviceInterest: params.serviceInterest || [],
          budget: params.budget || undefined,
          company: params.company || undefined,
        },
      })
    }
  } catch (err) {
    // Never block the main flow — log and continue
    console.error('[contacts:upsert]', err)
  }
}
