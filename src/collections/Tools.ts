import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tag', 'order'],
    description: 'Affiliate stack — what shows on Home.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'oneLiner',
      type: 'text',
      required: true,
    },
    {
      name: 'affiliateUrl',
      type: 'text',
    },
    {
      name: 'tag',
      type: 'text',
      admin: {
        description: 'Category label (e.g. AI Ads, Audio, Agents)',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 99,
    },
  ],
}
