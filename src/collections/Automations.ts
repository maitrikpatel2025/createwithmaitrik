import type { CollectionConfig } from 'payload'

export const Automations: CollectionConfig = {
  slug: 'automations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'trigger', 'active', 'lastRanAt', 'runCount'],
    description: 'If-then rules that run on hooks — cross-collection glue logic.',
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
          name: 'name',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'e.g. "Inquiry → Create Deal" or "Deal Won → Draft Invoice"' },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '25%' },
        },
        {
          name: 'priority',
          type: 'number',
          defaultValue: 10,
          admin: { width: '25%', description: 'Lower runs first' },
        },
      ],
    },
    {
      name: 'trigger',
      type: 'select',
      required: true,
      options: [
        { label: 'Inquiry Created', value: 'inquiry.created' },
        { label: 'Contact Created', value: 'contact.created' },
        { label: 'Deal Created', value: 'deal.created' },
        { label: 'Deal Stage Changed', value: 'deal.stageChanged' },
        { label: 'Invoice Created', value: 'invoice.created' },
        { label: 'Invoice Status Changed', value: 'invoice.statusChanged' },
        { label: 'Task Created', value: 'task.created' },
        { label: 'Task Completed', value: 'task.completed' },
        { label: 'Campaign Created', value: 'campaign.created' },
      ],
      admin: { description: 'When this event fires...' },
    },
    {
      name: 'conditions',
      type: 'json',
      admin: {
        description: 'Optional filter as JSON, e.g. {"stage": "Won"} or {"status": "paid"}. Empty = always run.',
      },
    },
    {
      name: 'actions',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { description: 'What to do when triggered' },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Create Document', value: 'create-doc' },
            { label: 'Update Document', value: 'update-doc' },
            { label: 'Create Notification', value: 'create-notification' },
            { label: 'Fire Webhook', value: 'fire-webhook' },
            { label: 'Log Activity', value: 'log-activity' },
          ],
        },
        {
          name: 'collection',
          type: 'text',
          admin: { description: 'Target collection for create/update (e.g. deals, invoices, notifications)' },
        },
        {
          name: 'data',
          type: 'json',
          admin: { description: 'Data payload as JSON. Use {{field}} for merge tags from trigger doc.' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { rows: 2 },
    },
    {
      name: 'lastRanAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'runCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'lastError',
      type: 'text',
      admin: { readOnly: true, description: 'Error message from last failed run' },
    },
  ],
}
