import type { CollectionConfig } from 'payload'
import { authOrApiKey } from '../lib/accessControl'
import { createAfterChangeHook } from '../lib/collectionHooks'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contact', 'type', 'startTime', 'status', 'createdAt'],
    description: 'Schedule and track meetings, demos, and consultations.',
  },
  access: {
    read: authOrApiKey('appointments', 'read'),
    create: authOrApiKey('appointments', 'write'),
    update: authOrApiKey('appointments', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { width: '40%' },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Call', value: 'call' },
            { label: 'Meeting', value: 'meeting' },
            { label: 'Demo', value: 'demo' },
            { label: 'Consultation', value: 'consultation' },
            { label: 'Follow-up', value: 'follow-up' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'scheduled',
          options: [
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'No-show', value: 'no-show' },
          ],
          admin: { width: '30%' },
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
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'endTime',
          type: 'date',
          admin: { width: '33%' },
        },
        {
          name: 'duration',
          type: 'number',
          label: 'Duration (minutes)',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Physical address, Google Meet link, Zoom URL, etc.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { rows: 3 },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'bookedBy',
          type: 'text',
          admin: { width: '33%' },
        },
        {
          name: 'reminderSent',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'googleCalendarId',
          type: 'text',
          admin: { width: '50%' },
        },
        {
          name: 'outlookCalendarId',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      createAfterChangeHook({
        created: 'appointment.created',
        statusChanged: 'appointment.statusChanged',
      }),
    ],
  },
}
