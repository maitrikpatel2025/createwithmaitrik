import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'read', 'createdAt'],
    description: 'Internal inbox — agents and automations flag items for human review.',
  },
  access: {
    read: authOrApiKey('notifications', 'read'),
    create: () => true, // agents and hooks can create
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'info',
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warning' },
            { label: 'Action Needed', value: 'action-needed' },
            { label: 'Success', value: 'success' },
            { label: 'Error', value: 'error' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'read',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '25%' },
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: { rows: 3 },
    },
    {
      name: 'relatedCollection',
      type: 'text',
      admin: { description: 'e.g. deals, invoices, team-tasks' },
    },
    {
      name: 'relatedDocId',
      type: 'text',
      admin: { description: 'ID of the related document' },
    },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'Direct admin URL, e.g. /admin/collections/deals/123' },
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Who created this — agent name, automation rule, or "system"' },
    },
  ],
}
