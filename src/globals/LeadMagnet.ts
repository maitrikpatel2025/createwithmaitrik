import type { GlobalConfig } from 'payload'

export const LeadMagnet: GlobalConfig = {
  slug: 'lead-magnet',
  admin: {
    description: 'The free PDF lead magnet + ConvertKit form binding.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'The AI Ad Stack',
    },
    {
      name: 'blurb',
      type: 'textarea',
      defaultValue:
        'The exact tools + character-sheet workflow I use to make agency-grade AI ads — free.',
    },
    {
      name: 'bullets',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
      label: 'Lead magnet PDF',
      admin: {
        description: 'Upload the PDF here. It will be served after email capture.',
      },
    },
    {
      name: 'emailFormId',
      type: 'text',
      label: 'Email tool form / tag ID',
      admin: {
        description: 'ConvertKit form ID or Beehiiv tag — used to subscribe + tag new leads',
      },
    },
  ],
}
