import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'status', 'source', 'country', 'tags', 'createdAt'],
    description: 'CRM — every subscriber, lead, and client. Full API at /api/contacts.',
  },
  access: {
    create: () => true,
    read: authOrApiKey('contacts', 'read'),
    update: authOrApiKey('contacts', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  unique: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'name',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  admin: { width: '25%' },
                },
                {
                  name: 'lastName',
                  type: 'text',
                  admin: { width: '25%' },
                },
                {
                  name: 'jobTitle',
                  type: 'text',
                  admin: { width: '25%' },
                },
                {
                  name: 'dateOfBirth',
                  type: 'date',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'Include country code (e.g. +1 647 ...)',
                  },
                },
                {
                  name: 'company',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'companyRef',
                  type: 'relationship',
                  relationTo: 'companies',
                  label: 'Company (linked)',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'lead',
                  options: [
                    { label: 'Lead', value: 'lead' },
                    { label: 'Subscriber', value: 'subscriber' },
                    { label: 'Prospect', value: 'prospect' },
                    { label: 'Client', value: 'client' },
                    { label: 'Partner', value: 'partner' },
                    { label: 'Archived', value: 'archived' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'source',
                  type: 'select',
                  options: [
                    { label: 'Newsletter', value: 'newsletter' },
                    { label: 'Lead Magnet', value: 'lead-magnet' },
                    { label: 'Service Inquiry', value: 'inquiry' },
                    { label: 'Partnership', value: 'partnership' },
                    { label: 'Ad Campaign', value: 'ad' },
                    { label: 'Referral', value: 'referral' },
                    { label: 'Manual', value: 'manual' },
                    { label: 'API', value: 'api' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: [
                'AI Ads',
                'AI Agents',
                'Built in Public',
                'Coaching',
                'Newsletter',
                'Lead Magnet',
                'Hot Lead',
                'VIP',
                'Meta Ads',
                'Google Ads',
                'TikTok Ads',
              ],
              admin: {
                description: 'Tags for segmentation, audiences, and automation triggers',
              },
            },
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'country',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'city',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'state',
                  type: 'text',
                  label: 'State / Province',
                  admin: { width: '50%' },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'address',
              type: 'text',
              label: 'Street address',
            },
          ],
        },
        {
          label: 'Business',
          fields: [
            {
              name: 'serviceInterest',
              type: 'select',
              hasMany: true,
              options: [
                'AI Ad Production',
                'AI Agent & Automation Builds',
                'Built-in-Public Coaching',
              ],
            },
            {
              name: 'budget',
              type: 'select',
              options: ['< $5k', '$5k – $15k', '$15k – $50k', '$50k+'],
            },
            {
              name: 'adPlatform',
              type: 'select',
              hasMany: true,
              label: 'Ad platforms',
              options: [
                { label: 'Meta (Facebook/Instagram)', value: 'meta' },
                { label: 'Google Ads', value: 'google' },
                { label: 'TikTok Ads', value: 'tiktok' },
                { label: 'YouTube Ads', value: 'youtube' },
                { label: 'LinkedIn Ads', value: 'linkedin' },
              ],
            },
            {
              name: 'industry',
              type: 'text',
              admin: { description: 'e.g. E-commerce, SaaS, Real Estate' },
            },
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Internal notes — not visible to the contact',
                rows: 4,
              },
            },
          ],
        },
        {
          label: 'Social & Identity',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'twitter',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'instagram',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'facebook',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'timezone',
                  type: 'text',
                  admin: { width: '33%', description: 'e.g. America/Toronto' },
                },
                {
                  name: 'preferredLanguage',
                  type: 'text',
                  admin: { width: '33%', description: 'e.g. en, fr, hi' },
                },
                {
                  name: 'profilePhoto',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Scoring & Lifecycle',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'leadScore',
                  type: 'number',
                  min: 0,
                  max: 100,
                  defaultValue: 0,
                  admin: { width: '33%', description: '0–100 lead quality score' },
                },
                {
                  name: 'lifecycleStage',
                  type: 'select',
                  defaultValue: 'visitor',
                  options: [
                    { label: 'Visitor', value: 'visitor' },
                    { label: 'Lead', value: 'lead' },
                    { label: 'MQL', value: 'mql' },
                    { label: 'SQL', value: 'sql' },
                    { label: 'Opportunity', value: 'opportunity' },
                    { label: 'Customer', value: 'customer' },
                    { label: 'Evangelist', value: 'evangelist' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'preferredContactMethod',
                  type: 'select',
                  options: [
                    { label: 'Email', value: 'email' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'referredBy',
              type: 'relationship',
              relationTo: 'contacts',
              admin: { description: 'Contact who referred this person' },
            },
            {
              name: 'lastContactedAt',
              type: 'date',
              admin: { readOnly: true, description: 'Auto-updated on communication' },
            },
          ],
        },
        {
          label: 'Consent',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'emailOptIn',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '25%' },
                },
                {
                  name: 'smsOptIn',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '25%' },
                },
                {
                  name: 'callOptIn',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '25%' },
                },
                {
                  name: 'doNotDisturb',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '25%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Custom Fields',
          fields: [
            {
              name: 'customFields',
              type: 'array',
              admin: {
                description: 'Flexible key-value fields for any extra data',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      type: 'text',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Activity',
          fields: [
            {
              name: 'activity',
              type: 'array',
              admin: {
                description: 'Auto-logged touchpoints (subscribe, inquiry, download, etc.)',
                readOnly: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'action',
                      type: 'text',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'detail',
                      type: 'text',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'timestamp',
                      type: 'date',
                      admin: { width: '20%' },
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
      createAfterChangeHook({ created: 'contact.created', updated: 'contact.updated' }),
    ],
  },
}
