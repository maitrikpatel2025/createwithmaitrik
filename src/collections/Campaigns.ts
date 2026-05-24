import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'platform', 'status', 'budget', 'startDate', 'endDate'],
    description: 'Track ad campaigns, link them to contacts and deals.',
  },
  access: {
    read: authOrApiKey('campaigns', 'read'),
    create: authOrApiKey('campaigns', 'write'),
    update: authOrApiKey('campaigns', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Campaign',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Meta (Facebook/Instagram)', value: 'meta' },
                    { label: 'Google Ads', value: 'google' },
                    { label: 'TikTok Ads', value: 'tiktok' },
                    { label: 'YouTube Ads', value: 'youtube' },
                    { label: 'LinkedIn Ads', value: 'linkedin' },
                    { label: 'Email', value: 'email' },
                    { label: 'Organic', value: 'organic' },
                    { label: 'Other', value: 'other' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'draft',
                  options: [
                    { label: 'Draft', value: 'draft' },
                    { label: 'Active', value: 'active' },
                    { label: 'Paused', value: 'paused' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Cancelled', value: 'cancelled' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'objective',
                  type: 'select',
                  options: [
                    { label: 'Awareness', value: 'awareness' },
                    { label: 'Traffic', value: 'traffic' },
                    { label: 'Leads', value: 'leads' },
                    { label: 'Conversions', value: 'conversions' },
                    { label: 'Engagement', value: 'engagement' },
                    { label: 'App Installs', value: 'app-installs' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startDate',
                  type: 'date',
                  admin: { width: '33%' },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  admin: { width: '33%' },
                },
                {
                  name: 'budget',
                  type: 'number',
                  label: 'Budget ($)',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'client',
              type: 'relationship',
              relationTo: 'contacts',
              admin: { description: 'Which client is this campaign for?' },
            },
            {
              name: 'deal',
              type: 'relationship',
              relationTo: 'deals',
              admin: { description: 'Link to a deal if applicable' },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { rows: 3 },
            },
          ],
        },
        {
          label: 'Performance',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'impressions', type: 'number', admin: { width: '25%' } },
                { name: 'clicks', type: 'number', admin: { width: '25%' } },
                { name: 'leads', type: 'number', label: 'Leads generated', admin: { width: '25%' } },
                { name: 'spend', type: 'number', label: 'Actual spend ($)', admin: { width: '25%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'cpm', type: 'number', label: 'CPM ($)', admin: { width: '25%' } },
                { name: 'cpc', type: 'number', label: 'CPC ($)', admin: { width: '25%' } },
                { name: 'cpl', type: 'number', label: 'CPL ($)', admin: { width: '25%' } },
                { name: 'roas', type: 'number', label: 'ROAS', admin: { width: '25%' } },
              ],
            },
            {
              name: 'conversionValue',
              type: 'number',
              label: 'Revenue / conversion value ($)',
            },
          ],
        },
        {
          label: 'Creatives',
          fields: [
            {
              name: 'creatives',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      options: ['Image', 'Video', 'Carousel', 'Story', 'Reel'],
                      admin: { width: '20%' },
                    },
                    {
                      name: 'asset',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { width: '40%' },
                    },
                  ],
                },
                {
                  name: 'copy',
                  type: 'textarea',
                  label: 'Ad copy',
                  admin: { rows: 2 },
                },
              ],
            },
          ],
        },
        {
          label: 'UTM & Tracking',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'utmSource', type: 'text', label: 'utm_source', admin: { width: '33%' } },
                { name: 'utmMedium', type: 'text', label: 'utm_medium', admin: { width: '33%' } },
                { name: 'utmCampaign', type: 'text', label: 'utm_campaign', admin: { width: '33%' } },
              ],
            },
            {
              name: 'trackingPixelId',
              type: 'text',
              label: 'Pixel / Tag ID',
              admin: { description: 'Meta Pixel ID, Google Tag, etc.' },
            },
            {
              name: 'landingPage',
              type: 'text',
              label: 'Landing page URL',
            },
            {
              name: 'externalCampaignId',
              type: 'text',
              label: 'External campaign ID',
              admin: { description: 'ID from Meta Ads Manager, Google Ads, etc.' },
            },
          ],
        },
        {
          label: 'Notes',
          fields: [
            {
              name: 'notes',
              type: 'textarea',
              admin: { rows: 5 },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      createAfterChangeHook({ created: 'campaign.created' }),
    ],
  },
}
