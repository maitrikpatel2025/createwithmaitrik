import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const Proposals: CollectionConfig = {
  slug: 'proposals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contact', 'status', 'validityDays', 'createdAt'],
    description: 'Sales proposals — create, send, track views, and collect signatures.',
  },
  access: {
    read: authOrApiKey('proposals', 'read'),
    create: authOrApiKey('proposals', 'write'),
    update: authOrApiKey('proposals', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Proposal',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'draft',
                  options: [
                    { label: 'Draft', value: 'draft' },
                    { label: 'Sent', value: 'sent' },
                    { label: 'Viewed', value: 'viewed' },
                    { label: 'Accepted', value: 'accepted' },
                    { label: 'Rejected', value: 'rejected' },
                    { label: 'Expired', value: 'expired' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'sentVia',
                  type: 'select',
                  options: [
                    { label: 'Email', value: 'email' },
                    { label: 'Link', value: 'link' },
                    { label: 'PDF', value: 'pdf' },
                  ],
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contact',
                  type: 'relationship',
                  relationTo: 'contacts',
                  admin: { width: '33%' },
                },
                {
                  name: 'company',
                  type: 'relationship',
                  relationTo: 'companies',
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
              name: 'coverPage',
              type: 'group',
              fields: [
                {
                  name: 'headline',
                  type: 'text',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                },
                {
                  name: 'coverImage',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'validityDays',
              type: 'number',
              defaultValue: 30,
              admin: {
                description: 'Days until proposal expires',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'sections',
              type: 'array',
              admin: {
                description: 'Proposal sections — add content blocks',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'content',
                  type: 'textarea',
                  required: true,
                  admin: { rows: 6 },
                },
                {
                  name: 'order',
                  type: 'number',
                  defaultValue: 0,
                },
              ],
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'pricingTable',
              type: 'array',
              admin: {
                description: 'Line items for this proposal',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'description',
                      type: 'text',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                      defaultValue: 1,
                      admin: { width: '15%' },
                    },
                    {
                      name: 'rate',
                      type: 'number',
                      admin: { width: '20%' },
                    },
                    {
                      name: 'amount',
                      type: 'number',
                      admin: {
                        width: '15%',
                        readOnly: true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'terms',
              type: 'textarea',
              admin: {
                rows: 4,
                description: 'Terms and conditions',
              },
            },
          ],
        },
        {
          label: 'Tracking',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'viewedAt',
                  type: 'date',
                  admin: {
                    readOnly: true,
                    width: '33%',
                  },
                },
                {
                  name: 'acceptedAt',
                  type: 'date',
                  admin: {
                    readOnly: true,
                    width: '33%',
                  },
                },
              ],
            },
            {
              name: 'signature',
              type: 'group',
              fields: [
                {
                  name: 'signedBy',
                  type: 'text',
                },
                {
                  name: 'signedAt',
                  type: 'date',
                },
                {
                  name: 'ipAddress',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate pricingTable amounts (quantity * rate)
        if (data.pricingTable) {
          data.pricingTable = data.pricingTable.map((item: any) => {
            const amount = (item.quantity || 1) * (item.rate || 0)
            return { ...item, amount }
          })
        }
        return data
      },
    ],
    afterChange: [
      createAfterChangeHook({
        created: 'proposal.created',
        statusChanged: 'proposal.statusChanged',
      }),
    ],
  },
}
