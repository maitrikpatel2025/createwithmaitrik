import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'

export const Pipelines: CollectionConfig = {
  slug: 'pipelines',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'stages', 'createdAt'],
    description: 'Sales & project pipelines — define stages, then drag deals through them.',
  },
  access: {
    read: authOrApiKey('pipelines', 'read'),
    create: authOrApiKey('pipelines', 'write'),
    update: authOrApiKey('pipelines', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Sales Pipeline, Ad Production, Client Onboarding' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { rows: 2 },
    },
    {
      name: 'stages',
      type: 'array',
      required: true,
      minRows: 2,
      admin: {
        description: 'Define the stages in order — deals move left to right',
      },
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
              name: 'color',
              type: 'select',
              defaultValue: 'gray',
              options: [
                { label: 'Gray', value: 'gray' },
                { label: 'Blue', value: 'blue' },
                { label: 'Green', value: 'green' },
                { label: 'Yellow', value: 'yellow' },
                { label: 'Orange', value: 'orange' },
                { label: 'Red', value: 'red' },
                { label: 'Purple', value: 'purple' },
              ],
              admin: { width: '30%' },
            },
            {
              name: 'autoAction',
              type: 'select',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Notify via email', value: 'notify' },
                { label: 'Mark contact as Client', value: 'mark-client' },
              ],
              defaultValue: 'none',
              admin: {
                width: '30%',
                description: 'Trigger when a deal enters this stage',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
