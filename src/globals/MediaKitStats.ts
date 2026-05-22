import type { GlobalConfig } from 'payload'

export const MediaKitStats: GlobalConfig = {
  slug: 'media-kit-stats',
  admin: {
    description: 'The four proof-of-work stat cards on the Partnerships page. Swap in audience numbers later.',
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', admin: { description: 'e.g. $2.3M or 47' } },
        { name: 'label', type: 'text' },
      ],
    },
  ],
}
