import type { CollectionConfig } from 'payload'

export const NewsletterIssues: CollectionConfig = {
  slug: 'newsletter-issues',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date'],
    description: 'Past newsletter issues — link to the live archive in the email tool.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Link to issue',
      admin: {
        description: 'URL of the issue in the email tool (ConvertKit/Beehiiv)',
      },
    },
    {
      name: 'issueNumber',
      type: 'text',
      label: 'Issue #',
    },
  ],
}
