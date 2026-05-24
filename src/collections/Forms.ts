import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'submitAction', 'submissionCount', 'createdAt'],
    description: 'Dynamic form builder — create embeddable forms that feed into the CRM.',
  },
  access: {
    read: authOrApiKey('forms', 'read'),
    create: authOrApiKey('forms', 'write'),
    update: authOrApiKey('forms', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Form',
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
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'fields',
              type: 'array',
              required: true,
              minRows: 1,
              admin: {
                description: 'Define form fields — these render in the embeddable form',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '30%',
                        description: 'Field name / label',
                      },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Text', value: 'text' },
                        { label: 'Email', value: 'email' },
                        { label: 'Phone', value: 'phone' },
                        { label: 'Select', value: 'select' },
                        { label: 'Textarea', value: 'textarea' },
                        { label: 'Checkbox', value: 'checkbox' },
                        { label: 'Number', value: 'number' },
                        { label: 'Date', value: 'date' },
                        { label: 'File', value: 'file' },
                      ],
                      admin: { width: '25%' },
                    },
                    {
                      name: 'required',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '15%' },
                    },
                    {
                      name: 'options',
                      type: 'text',
                      admin: {
                        width: '30%',
                        description: 'Comma-separated for select fields',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Actions',
          fields: [
            {
              name: 'submitAction',
              type: 'select',
              required: true,
              defaultValue: 'create-contact',
              options: [
                { label: 'Create Contact', value: 'create-contact' },
                { label: 'Create Inquiry', value: 'create-inquiry' },
                { label: 'Webhook', value: 'webhook' },
                { label: 'Redirect', value: 'redirect' },
              ],
              admin: {
                description: 'What happens when someone submits',
              },
            },
            {
              name: 'redirectUrl',
              type: 'text',
              admin: {
                description: 'Redirect URL after submission (for redirect action)',
              },
            },
            {
              name: 'notificationEmail',
              type: 'email',
              admin: {
                description: 'Send notification to this email on submission',
              },
            },
          ],
        },
        {
          label: 'Stats',
          fields: [
            {
              name: 'submissionCount',
              type: 'number',
              defaultValue: 0,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'embedCode',
              type: 'textarea',
              admin: {
                readOnly: true,
                rows: 3,
                description: 'Auto-generated embed snippet',
              },
            },
          ],
        },
      ],
    },
  ],
}
