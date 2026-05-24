import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'reviewText',
    defaultColumns: ['platform', 'rating', 'contact', 'status', 'datePosted'],
    description: 'Track and respond to client reviews across platforms.',
  },
  access: {
    read: authOrApiKey('reviews', 'read'),
    create: authOrApiKey('reviews', 'write'),
    update: authOrApiKey('reviews', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Yelp', value: 'yelp' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Trustpilot', value: 'trustpilot' },
            { label: 'Clutch', value: 'clutch' },
            { label: 'G2', value: 'g2' },
            { label: 'Other', value: 'other' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          admin: { width: '25%' },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Responded', value: 'responded' },
            { label: 'Flagged', value: 'flagged' },
            { label: 'Archived', value: 'archived' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'datePosted',
          type: 'date',
          admin: { width: '25%' },
        },
      ],
    },
    {
      name: 'contact',
      type: 'relationship',
      relationTo: 'contacts',
      admin: {
        description: 'Link to the client who left the review',
      },
    },
    {
      name: 'reviewText',
      type: 'textarea',
      required: true,
      admin: {
        rows: 4,
        description: 'The review content',
      },
    },
    {
      name: 'reviewUrl',
      type: 'text',
      admin: {
        description: 'Direct link to the review',
      },
    },
    {
      name: 'responseText',
      type: 'textarea',
      admin: {
        rows: 4,
        description: 'Your public response to the review',
      },
    },
  ],
}
