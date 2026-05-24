import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const AICallQueue: CollectionConfig = {
  slug: 'ai-call-queue',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['contact', 'agent', 'priority', 'status', 'scheduledFor', 'attemptCount'],
    description: 'Queue of AI calls to be made — scheduling, retries, and results.',
  },
  access: {
    read: authOrApiKey('ai-call-queue', 'read'),
    create: authOrApiKey('ai-call-queue', 'write'),
    update: authOrApiKey('ai-call-queue', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'contact',
          type: 'relationship',
          relationTo: 'contacts',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'agent',
          type: 'relationship',
          relationTo: 'ai-agents',
          admin: { width: '33%' },
        },
        {
          name: 'deal',
          type: 'relationship',
          relationTo: 'deals',
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priority',
          type: 'number',
          defaultValue: 3,
          admin: {
            width: '25%',
            description: '1=highest, 5=lowest',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'result',
          type: 'select',
          options: [
            { label: 'Answered', value: 'answered' },
            { label: 'No Answer', value: 'no-answer' },
            { label: 'Voicemail', value: 'voicemail' },
            { label: 'Busy', value: 'busy' },
            { label: 'Failed', value: 'failed' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'scheduledFor',
          type: 'date',
          admin: { width: '25%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'attemptCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '25%',
            readOnly: true,
          },
        },
        {
          name: 'maxAttempts',
          type: 'number',
          defaultValue: 3,
          admin: { width: '25%' },
        },
        {
          name: 'retryInterval',
          type: 'number',
          defaultValue: 60,
          admin: {
            width: '25%',
            description: 'Minutes between retries',
          },
        },
        {
          name: 'lastAttemptedAt',
          type: 'date',
          admin: {
            width: '25%',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'callContext',
      type: 'json',
      admin: {
        description: 'Context for the AI agent — reason, notes, deal value, etc.',
      },
    },
    {
      name: 'resultingCommLog',
      type: 'relationship',
      relationTo: 'communication-log',
      admin: {
        description: 'Link to the communication log entry created after the call',
      },
    },
  ],
  hooks: {
    afterChange: [
      createAfterChangeHook({
        created: 'ai-call.queued',
        statusChanged: 'ai-call.statusChanged',
      }),
    ],
  },
}
