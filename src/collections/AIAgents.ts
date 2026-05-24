import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'

export const AIAgents: CollectionConfig = {
  slug: 'ai-agents',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'agentType', 'active', 'createdAt'],
    description: 'AI-powered agents — voice callers, SMS bots, email assistants.',
  },
  access: {
    read: authOrApiKey('ai-agents', 'read'),
    create: authOrApiKey('ai-agents', 'write'),
    update: authOrApiKey('ai-agents', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Agent Config',
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
                  name: 'agentType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Inbound Caller', value: 'inbound-caller' },
                    { label: 'Outbound Caller', value: 'outbound-caller' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Email', value: 'email' },
                    { label: 'Chat', value: 'chat' },
                  ],
                  admin: { width: '30%' },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '15%' },
                },
                {
                  name: 'language',
                  type: 'text',
                  defaultValue: 'en-US',
                  admin: { width: '15%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'voiceProvider',
                  type: 'select',
                  options: [
                    { label: 'ElevenLabs', value: 'elevenlabs' },
                    { label: 'Azure', value: 'azure' },
                    { label: 'Google', value: 'google' },
                    { label: 'Twilio', value: 'twilio' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'voiceId',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'systemPrompt',
              type: 'textarea',
              required: true,
              admin: {
                rows: 6,
                description: 'Base system prompt for the agent',
              },
            },
            {
              name: 'greetingScript',
              type: 'textarea',
              admin: { rows: 3 },
            },
            {
              name: 'goal',
              type: 'text',
              admin: { description: 'Primary objective, e.g. Book a consultation' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'maxDuration',
                  type: 'number',
                  label: 'Max call duration (seconds)',
                  admin: { width: '33%' },
                },
                {
                  name: 'transferNumber',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'webhookUrl',
                  type: 'text',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'transferConditions',
              type: 'textarea',
              admin: { rows: 2 },
            },
          ],
        },
        {
          label: 'Objection Handling',
          fields: [
            {
              name: 'objectionHandling',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'objection',
                      type: 'text',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'response',
                      type: 'textarea',
                      required: true,
                      admin: { width: '60%', rows: 2 },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Working Hours',
          fields: [
            {
              name: 'workingHours',
              type: 'array',
              admin: {
                description: 'Define when this agent is available',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'day',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Monday', value: 'monday' },
                        { label: 'Tuesday', value: 'tuesday' },
                        { label: 'Wednesday', value: 'wednesday' },
                        { label: 'Thursday', value: 'thursday' },
                        { label: 'Friday', value: 'friday' },
                        { label: 'Saturday', value: 'saturday' },
                        { label: 'Sunday', value: 'sunday' },
                      ],
                      admin: { width: '40%' },
                    },
                    {
                      name: 'start',
                      type: 'text',
                      required: true,
                      defaultValue: '09:00',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'end',
                      type: 'text',
                      required: true,
                      defaultValue: '17:00',
                      admin: { width: '30%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'pipeline',
              type: 'relationship',
              relationTo: 'pipelines',
            },
            {
              name: 'stage',
              type: 'text',
              admin: { description: 'Default stage for deals created by this agent' },
            },
            {
              name: 'linkedTemplates',
              type: 'relationship',
              relationTo: 'templates',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
}
