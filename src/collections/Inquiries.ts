import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'serviceType', 'budget', 'submittedAt'],
    description: 'Read-only — submissions from the Services application form.',
  },
  access: {
    create: () => true,
    read: authOrApiKey('inquiries', 'read'),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'serviceType',
      type: 'select',
      options: [
        'AI Ad Production',
        'AI Agent & Automation Builds',
        'Built-in-Public Coaching',
        'Not sure yet',
      ],
    },
    {
      name: 'budget',
      type: 'select',
      options: ['< $5k', '$5k – $15k', '$15k – $50k', '$50k+'],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.submittedAt = new Date().toISOString()
        return data
      },
    ],
    afterChange: [
      createAfterChangeHook({ created: 'inquiry.created' }),
    ],
  },
}
