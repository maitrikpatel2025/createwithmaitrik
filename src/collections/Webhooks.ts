import type { CollectionConfig } from 'payload'

export const Webhooks: CollectionConfig = {
  slug: 'webhooks',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'event', 'url', 'active', 'lastTriggeredAt'],
    description: 'Outbound webhooks — fire POST requests when CMS events occur.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { width: '40%', description: 'e.g. "Make — New Inquiry" or "n8n — Deal Won"' },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '20%' },
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'Full URL to POST to (e.g. https://hook.us1.make.com/abc123)' },
    },
    {
      name: 'event',
      type: 'select',
      required: true,
      hasMany: true,
      options: [
        { label: 'Inquiry Created', value: 'inquiry.created' },
        { label: 'Contact Created', value: 'contact.created' },
        { label: 'Contact Updated', value: 'contact.updated' },
        { label: 'Deal Created', value: 'deal.created' },
        { label: 'Deal Stage Changed', value: 'deal.stageChanged' },
        { label: 'Deal Won', value: 'deal.won' },
        { label: 'Invoice Created', value: 'invoice.created' },
        { label: 'Invoice Paid', value: 'invoice.paid' },
        { label: 'Task Created', value: 'task.created' },
        { label: 'Task Completed', value: 'task.completed' },
        { label: 'Campaign Created', value: 'campaign.created' },
      ],
      admin: { description: 'Which events trigger this webhook' },
    },
    {
      name: 'secret',
      type: 'text',
      admin: {
        description: 'HMAC secret for signature verification (sent as X-CWM-Signature header)',
      },
    },
    {
      name: 'headers',
      type: 'array',
      admin: { description: 'Extra headers to send with the webhook' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'key', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      name: 'lastTriggeredAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'lastStatus',
      type: 'number',
      admin: { readOnly: true, description: 'HTTP status from last delivery' },
    },
    {
      name: 'failCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, description: 'Consecutive failures (resets on success)' },
    },
  ],
}
