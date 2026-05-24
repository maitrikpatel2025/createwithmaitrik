import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'contact', 'status', 'total', 'dueDate', 'createdAt'],
    description: 'Track quotes, invoices, and payments.',
  },
  access: {
    read: authOrApiKey('invoices', 'read'),
    create: authOrApiKey('invoices', 'write'),
    update: authOrApiKey('invoices', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'invoiceNumber',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '30%',
            description: 'e.g. INV-001, QUOTE-012',
          },
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
            { label: 'Paid', value: 'paid' },
            { label: 'Partial', value: 'partial' },
            { label: 'Overdue', value: 'overdue' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          admin: { width: '20%' },
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'invoice',
          options: [
            { label: 'Quote', value: 'quote' },
            { label: 'Invoice', value: 'invoice' },
            { label: 'Receipt', value: 'receipt' },
          ],
          admin: { width: '20%' },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'CAD',
          options: ['CAD', 'USD', 'INR', 'GBP', 'EUR'],
          admin: { width: '15%' },
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
          admin: {
            width: '33%',
            description: 'Link to a deal/project',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'issueDate',
          type: 'date',
          admin: { width: '33%' },
        },
        {
          name: 'dueDate',
          type: 'date',
          admin: { width: '33%' },
        },
        {
          name: 'paidDate',
          type: 'date',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'lineItems',
      type: 'array',
      label: 'Line items',
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
              label: 'Unit price',
              admin: { width: '20%' },
            },
            {
              name: 'amount',
              type: 'number',
              admin: {
                width: '15%',
                readOnly: true,
                description: 'Auto-calculated',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          admin: { width: '25%', readOnly: true },
        },
        {
          name: 'taxRate',
          type: 'number',
          label: 'Tax %',
          defaultValue: 13,
          admin: { width: '25%', description: 'HST default 13%' },
        },
        {
          name: 'taxAmount',
          type: 'number',
          admin: { width: '25%', readOnly: true },
        },
        {
          name: 'total',
          type: 'number',
          admin: { width: '25%', readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'discount',
          type: 'number',
          admin: { width: '25%', description: 'Discount amount' },
        },
        {
          name: 'discountType',
          type: 'select',
          defaultValue: 'percentage',
          options: [
            { label: 'Percentage', value: 'percentage' },
            { label: 'Flat Amount', value: 'flat' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'deposit',
          type: 'number',
          admin: { width: '25%', description: 'Upfront deposit amount' },
        },
        {
          name: 'viewedAt',
          type: 'date',
          admin: { width: '25%', readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'recurring',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '20%' },
        },
        {
          name: 'recurringInterval',
          type: 'select',
          options: [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Bi-weekly', value: 'biweekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Annually', value: 'annually' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'nextInvoiceDate',
          type: 'date',
          admin: { width: '25%' },
        },
        {
          name: 'stripePaymentLink',
          type: 'text',
          admin: { width: '25%', description: 'Stripe payment link URL' },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes / terms',
      admin: { rows: 3, description: 'Payment terms, thank you note, etc.' },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'E-Transfer', value: 'etransfer' },
        { label: 'Stripe', value: 'stripe' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Wire Transfer', value: 'wire' },
        { label: 'Cash', value: 'cash' },
        { label: 'Other', value: 'other' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate line item amounts and totals
        if (data.lineItems) {
          let subtotal = 0
          data.lineItems = data.lineItems.map((item: any) => {
            const amount = (item.quantity || 1) * (item.rate || 0)
            subtotal += amount
            return { ...item, amount }
          })
          data.subtotal = subtotal
          const taxRate = data.taxRate ?? 13
          data.taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
          data.total = Math.round((subtotal + data.taxAmount) * 100) / 100
        }
        return data
      },
    ],
    afterChange: [
      createAfterChangeHook({
        created: 'invoice.created',
        statusChanged: 'invoice.statusChanged',
        paid: 'invoice.paid',
      }),
    ],
  },
}
