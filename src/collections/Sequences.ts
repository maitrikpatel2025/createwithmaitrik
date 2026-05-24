import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'

export const Sequences: CollectionConfig = {
  slug: 'sequences',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'trigger', 'status', 'enrolledCount', 'completedCount', 'createdAt'],
    description: 'Multi-step outreach sequences — automated follow-up workflows.',
  },
  access: {
    read: authOrApiKey('sequences', 'read'),
    create: authOrApiKey('sequences', 'write'),
    update: authOrApiKey('sequences', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sequence',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: { width: '40%' },
                },
                {
                  name: 'trigger',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Manual', value: 'manual' },
                    { label: 'Inquiry Created', value: 'inquiry-created' },
                    { label: 'Deal Stage Change', value: 'deal-stage-change' },
                    { label: 'Contact Created', value: 'contact-created' },
                    { label: 'Form Submitted', value: 'form-submitted' },
                  ],
                  admin: { width: '30%' },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'active',
                  options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Paused', value: 'paused' },
                    { label: 'Archived', value: 'archived' },
                  ],
                  admin: { width: '30%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { rows: 2 },
            },
          ],
        },
        {
          label: 'Steps',
          fields: [
            {
              name: 'steps',
              type: 'array',
              required: true,
              minRows: 1,
              admin: {
                description: 'Steps execute in order — add waits between actions',
              },
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
                        { label: 'SMS', value: 'sms' },
                        { label: 'Call', value: 'call' },
                        { label: 'Wait', value: 'wait' },
                        { label: 'Task', value: 'task' },
                      ],
                      admin: { width: '25%' },
                    },
                    {
                      name: 'waitDuration',
                      type: 'number',
                      label: 'Wait (minutes)',
                      admin: {
                        width: '25%',
                        description: 'Minutes to wait before this step',
                      },
                    },
                    {
                      name: 'template',
                      type: 'relationship',
                      relationTo: 'templates',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'aiAgent',
                      type: 'relationship',
                      relationTo: 'ai-agents',
                      admin: { width: '25%' },
                    },
                  ],
                },
                {
                  name: 'skipCondition',
                  type: 'json',
                  admin: {
                    description: 'Skip this step if condition matches, e.g. {"status": "client"}',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Stats',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'enrolledCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '33%' },
                },
                {
                  name: 'completedCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '33%' },
                },
                {
                  name: 'conversionRate',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                    width: '33%',
                    description: 'Percentage',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
