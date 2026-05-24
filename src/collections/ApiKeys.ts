import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'keyPrefix', 'permissions', 'active', 'lastUsedAt'],
    description: 'API keys for agents, webhooks, and external integrations.',
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
          admin: { width: '50%', description: 'e.g. "CRM Agent", "Make.com Webhook", "n8n Integration"' },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '25%' },
        },
        {
          name: 'expiresAt',
          type: 'date',
          admin: { width: '25%', description: 'Leave blank for no expiry' },
        },
      ],
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated. Copy this once — it cannot be viewed again after creation.',
      },
    },
    {
      name: 'keyPrefix',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'First 8 chars for identification',
      },
    },
    {
      name: 'permissions',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Read Contacts', value: 'contacts:read' },
        { label: 'Write Contacts', value: 'contacts:write' },
        { label: 'Read Deals', value: 'deals:read' },
        { label: 'Write Deals', value: 'deals:write' },
        { label: 'Read Invoices', value: 'invoices:read' },
        { label: 'Write Invoices', value: 'invoices:write' },
        { label: 'Read Campaigns', value: 'campaigns:read' },
        { label: 'Write Campaigns', value: 'campaigns:write' },
        { label: 'Read Team Tasks', value: 'team-tasks:read' },
        { label: 'Write Team Tasks', value: 'team-tasks:write' },
        { label: 'Read Pipelines', value: 'pipelines:read' },
        { label: 'Write Pipelines', value: 'pipelines:write' },
        { label: 'Read Inquiries', value: 'inquiries:read' },
        { label: 'Read Playbooks', value: 'playbooks:read' },
        { label: 'Write Playbooks', value: 'playbooks:write' },
        { label: 'Read Activity Log', value: 'activity-log:read' },
        { label: 'Write Activity Log', value: 'activity-log:write' },
        { label: 'Read Notifications', value: 'notifications:read' },
        { label: 'Write Notifications', value: 'notifications:write' },
        { label: 'Read Webhooks', value: 'webhooks:read' },
        { label: 'Write Webhooks', value: 'webhooks:write' },
        { label: 'Read Companies', value: 'companies:read' },
        { label: 'Write Companies', value: 'companies:write' },
        { label: 'Read Communication Log', value: 'communication-log:read' },
        { label: 'Write Communication Log', value: 'communication-log:write' },
        { label: 'Read AI Agents', value: 'ai-agents:read' },
        { label: 'Write AI Agents', value: 'ai-agents:write' },
        { label: 'Read AI Call Queue', value: 'ai-call-queue:read' },
        { label: 'Write AI Call Queue', value: 'ai-call-queue:write' },
        { label: 'Read Sequences', value: 'sequences:read' },
        { label: 'Write Sequences', value: 'sequences:write' },
        { label: 'Read Appointments', value: 'appointments:read' },
        { label: 'Write Appointments', value: 'appointments:write' },
        { label: 'Read Forms', value: 'forms:read' },
        { label: 'Write Forms', value: 'forms:write' },
        { label: 'Read Proposals', value: 'proposals:read' },
        { label: 'Write Proposals', value: 'proposals:write' },
        { label: 'Read Reviews', value: 'reviews:read' },
        { label: 'Write Reviews', value: 'reviews:write' },
        { label: 'Read Dashboard', value: 'dashboard:read' },
        { label: 'Full Access', value: 'full-access' },
      ],
      admin: {
        description: 'Scoped permissions — only grant what the agent/integration needs',
      },
    },
    {
      name: 'rateLimit',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Max requests per minute (0 = unlimited)' },
    },
    {
      name: 'lastUsedAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { rows: 2, description: 'Internal notes about this key' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.key) {
          const rawKey = `cwm_${crypto.randomBytes(32).toString('hex')}`
          data.key = rawKey
          data.keyPrefix = rawKey.slice(0, 12)
        }
        return data
      },
    ],
  },
}
