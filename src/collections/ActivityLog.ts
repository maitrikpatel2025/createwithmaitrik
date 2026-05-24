import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'

export const ActivityLog: CollectionConfig = {
  slug: 'activity-log',
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'collection', 'action', 'actor', 'createdAt'],
    description: 'Global audit trail — every create/update/delete across all collections.',
  },
  access: {
    read: authOrApiKey('activity-log', 'read'),
    create: () => true, // hooks and agents can write
    update: () => false, // immutable
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'action',
          type: 'select',
          required: true,
          options: [
            { label: 'Created', value: 'create' },
            { label: 'Updated', value: 'update' },
            { label: 'Deleted', value: 'delete' },
            { label: 'Stage Changed', value: 'stage-change' },
            { label: 'Status Changed', value: 'status-change' },
            { label: 'Login', value: 'login' },
            { label: 'API Call', value: 'api-call' },
            { label: 'Webhook Fired', value: 'webhook-fired' },
            { label: 'Automation Ran', value: 'automation-ran' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'collection',
          type: 'text',
          required: true,
          admin: { width: '25%', description: 'e.g. deals, contacts, invoices' },
        },
        {
          name: 'docId',
          type: 'text',
          admin: { width: '25%', description: 'ID of the affected document' },
        },
        {
          name: 'actor',
          type: 'text',
          admin: { width: '25%', description: 'User email, agent name, or "system"' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'text',
      required: true,
      admin: { description: 'Human-readable summary, e.g. "Deal moved from Lead to Proposal"' },
    },
    {
      name: 'details',
      type: 'json',
      admin: { description: 'Full diff or context as JSON' },
    },
    {
      name: 'ip',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
}
