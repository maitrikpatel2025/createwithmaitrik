import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'industry', 'size', 'primaryContact', 'createdAt'],
    description: 'B2B companies — link contacts, deals, and invoices to organizations.',
  },
  access: {
    read: authOrApiKey('companies', 'read'),
    create: authOrApiKey('companies', 'write'),
    update: authOrApiKey('companies', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'legalName',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'industry',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'size',
                  type: 'select',
                  options: [
                    { label: '1-10', value: '1-10' },
                    { label: '11-50', value: '11-50' },
                    { label: '51-200', value: '51-200' },
                    { label: '201-500', value: '201-500' },
                    { label: '500+', value: '500+' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'revenue',
                  type: 'select',
                  options: [
                    { label: '<1M', value: '<1M' },
                    { label: '1M-10M', value: '1M-10M' },
                    { label: '10M-50M', value: '10M-50M' },
                    { label: '50M+', value: '50M+' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'fax',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'email',
                  type: 'email',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'website',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: { rows: 3 },
                },
              ],
            },
            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: [
                'enterprise',
                'smb',
                'startup',
                'agency',
                'ai',
                'ecommerce',
                'saas',
                'media',
              ],
            },
          ],
        },
        {
          label: 'Address',
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                },
                {
                  name: 'city',
                  type: 'text',
                },
                {
                  name: 'state',
                  type: 'text',
                },
                {
                  name: 'postalCode',
                  type: 'text',
                },
                {
                  name: 'country',
                  type: 'text',
                },
              ],
            },
            {
              name: 'billingAddress',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                },
                {
                  name: 'city',
                  type: 'text',
                },
                {
                  name: 'state',
                  type: 'text',
                },
                {
                  name: 'postalCode',
                  type: 'text',
                },
                {
                  name: 'country',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Financial',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'taxId',
                  type: 'text',
                  admin: { width: '33%' },
                },
                {
                  name: 'registrationNumber',
                  type: 'text',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'paymentTerms',
                  type: 'select',
                  options: [
                    { label: 'Net 15', value: 'net-15' },
                    { label: 'Net 30', value: 'net-30' },
                    { label: 'Net 45', value: 'net-45' },
                    { label: 'Net 60', value: 'net-60' },
                    { label: 'Due on Receipt', value: 'due-on-receipt' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'currency',
                  type: 'select',
                  options: ['CAD', 'USD', 'INR', 'GBP', 'EUR'],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'bankDetails',
              type: 'textarea',
              admin: {
                rows: 3,
                description: 'Wire transfer details — kept confidential',
              },
            },
          ],
        },
        {
          label: 'Social',
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
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'primaryContact',
              type: 'relationship',
              relationTo: 'contacts',
            },
            {
              name: 'contacts',
              type: 'relationship',
              relationTo: 'contacts',
              hasMany: true,
            },
            {
              name: 'deals',
              type: 'relationship',
              relationTo: 'deals',
              hasMany: true,
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: { rows: 4 },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      createAfterChangeHook({ created: 'company.created', updated: 'company.updated' }),
    ],
  },
}
