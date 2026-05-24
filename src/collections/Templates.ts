import type { CollectionConfig } from 'payload'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'updatedAt'],
    description: 'Reusable templates for emails, invoices, and pipelines — agents use these for speed.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'e.g. "Spec Ad Package Invoice" or "Inquiry Follow-Up Email"' },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Email Template', value: 'email' },
            { label: 'Invoice Template', value: 'invoice' },
            { label: 'Pipeline Template', value: 'pipeline' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '25%' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { rows: 2 },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Welcome', value: 'welcome' },
            { label: 'Follow-Up', value: 'follow-up' },
            { label: 'Proposal', value: 'proposal' },
            { label: 'Invoice', value: 'invoice' },
            { label: 'Nurture', value: 'nurture' },
            { label: 'Re-engagement', value: 're-engagement' },
            { label: 'Post-Call', value: 'post-call' },
            { label: 'Appointment Confirmation', value: 'appointment-confirmation' },
            { label: 'Review Request', value: 'review-request' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'sendDelay',
          type: 'number',
          admin: { width: '25%', description: 'Delay in minutes before sending' },
        },
        {
          name: 'sequenceOrder',
          type: 'number',
          admin: { width: '25%', description: 'Order within a sequence' },
        },
        {
          name: 'sequenceGroup',
          type: 'text',
          admin: { width: '25%', description: 'Group name, e.g. inquiry-nurture' },
        },
      ],
    },
    // --- Email template fields ---
    {
      name: 'emailSubject',
      type: 'text',
      admin: {
        description: 'Subject line with merge tags: {{contact.name}}, {{deal.title}}',
        condition: (data) => data.type === 'email',
      },
    },
    {
      name: 'emailBody',
      type: 'textarea',
      admin: {
        rows: 10,
        description: 'Email body with merge tags: {{contact.name}}, {{contact.email}}, {{deal.title}}, {{deal.value}}',
        condition: (data) => data.type === 'email',
      },
    },
    // --- Invoice template fields ---
    {
      name: 'invoiceLineItems',
      type: 'array',
      admin: {
        description: 'Pre-filled line items for this template',
        condition: (data) => data.type === 'invoice',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'description', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'quantity', type: 'number', defaultValue: 1, admin: { width: '15%' } },
            { name: 'rate', type: 'number', admin: { width: '20%' } },
          ],
        },
      ],
    },
    {
      name: 'invoiceTaxRate',
      type: 'number',
      defaultValue: 13,
      admin: {
        description: 'Default tax rate for this template',
        condition: (data) => data.type === 'invoice',
      },
    },
    {
      name: 'invoiceCurrency',
      type: 'select',
      defaultValue: 'CAD',
      options: ['CAD', 'USD', 'INR', 'GBP', 'EUR'],
      admin: {
        condition: (data) => data.type === 'invoice',
      },
    },
    {
      name: 'invoiceNotes',
      type: 'textarea',
      admin: {
        rows: 3,
        description: 'Default notes/terms for invoices from this template',
        condition: (data) => data.type === 'invoice',
      },
    },
    // --- Pipeline template fields ---
    {
      name: 'pipelineStages',
      type: 'array',
      admin: {
        description: 'Stages for quick-creating a pipeline from this template',
        condition: (data) => data.type === 'pipeline',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
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
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },
  ],
}
