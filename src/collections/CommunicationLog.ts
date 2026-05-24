import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const CommunicationLog: CollectionConfig = {
  slug: 'communication-log',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['type', 'contact', 'direction', 'subject', 'status', 'createdAt'],
    description: 'Track all communications — emails, calls, SMS, meetings, and AI interactions.',
  },
  access: {
    read: authOrApiKey('communication-log', 'read'),
    create: authOrApiKey('communication-log', 'write'),
    update: authOrApiKey('communication-log', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Communication',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Email', value: 'email' },
                    { label: 'Call', value: 'call' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Meeting', value: 'meeting' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'LinkedIn', value: 'linkedin' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'direction',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Inbound', value: 'inbound' },
                    { label: 'Outbound', value: 'outbound' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'draft',
                  options: [
                    { label: 'Draft', value: 'draft' },
                    { label: 'Sent', value: 'sent' },
                    { label: 'Delivered', value: 'delivered' },
                    { label: 'Read', value: 'read' },
                    { label: 'Failed', value: 'failed' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'No Answer', value: 'no-answer' },
                    { label: 'Voicemail', value: 'voicemail' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'channel',
                  type: 'text',
                  admin: {
                    width: '25%',
                    description: 'e.g. gmail, twilio, slack',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contact',
                  type: 'relationship',
                  relationTo: 'contacts',
                  admin: { width: '50%' },
                },
                {
                  name: 'company',
                  type: 'relationship',
                  relationTo: 'companies',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'deal',
              type: 'relationship',
              relationTo: 'deals',
            },
            {
              name: 'subject',
              type: 'text',
            },
            {
              name: 'body',
              type: 'textarea',
              admin: { rows: 6 },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  type: 'number',
                  label: 'Duration (seconds)',
                  admin: { width: '33%' },
                },
                {
                  name: 'scheduledAt',
                  type: 'date',
                  admin: { width: '33%' },
                },
                {
                  name: 'completedAt',
                  type: 'date',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: [
                'follow-up',
                'cold-outreach',
                'nurture',
                'support',
                'onboarding',
                'upsell',
                'renewal',
              ],
            },
          ],
        },
        {
          label: 'AI Analysis',
          fields: [
            {
              name: 'aiCallSummary',
              type: 'textarea',
              admin: {
                rows: 4,
                description: 'AI-generated call summary',
              },
            },
            {
              name: 'aiSentiment',
              type: 'select',
              options: [
                { label: 'Positive', value: 'positive' },
                { label: 'Neutral', value: 'neutral' },
                { label: 'Negative', value: 'negative' },
                { label: 'Mixed', value: 'mixed' },
              ],
            },
            {
              name: 'aiActionItems',
              type: 'textarea',
              admin: {
                rows: 3,
                description: 'AI-extracted action items',
              },
            },
            {
              name: 'aiTranscript',
              type: 'textarea',
              admin: {
                rows: 10,
                description: 'Full call transcript',
              },
            },
          ],
        },
        {
          label: 'Attachments',
          fields: [
            {
              name: 'agent',
              type: 'relationship',
              relationTo: 'ai-agents',
              admin: { description: 'AI agent that handled this communication' },
            },
            {
              name: 'templateUsed',
              type: 'relationship',
              relationTo: 'templates',
            },
            {
              name: 'recordingUrl',
              type: 'text',
              admin: { description: 'External URL to call recording' },
            },
            {
              name: 'recordingFile',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'attachments',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      createAfterChangeHook({ created: 'communication.created' }),
    ],
  },
}
