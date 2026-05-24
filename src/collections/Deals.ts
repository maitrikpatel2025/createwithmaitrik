import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const Deals: CollectionConfig = {
  slug: 'deals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contact', 'pipeline', 'stage', 'value', 'priority', 'updatedAt'],
    description: 'Opportunities & projects that move through pipeline stages.',
  },
  access: {
    read: authOrApiKey('deals', 'read'),
    create: authOrApiKey('deals', 'write'),
    update: authOrApiKey('deals', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Deal',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Burberry Spec Ad Campaign" or "LaneOne AI Agents"' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pipeline',
                  type: 'relationship',
                  relationTo: 'pipelines',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'stage',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Must match a stage name in the selected pipeline',
                  },
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
                  admin: { width: '50%' },
                },
                {
                  name: 'value',
                  type: 'number',
                  label: 'Deal value ($)',
                  admin: { width: '25%' },
                },
                {
                  name: 'priority',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Urgent', value: 'urgent' },
                  ],
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { rows: 3 },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'expectedClose',
                  type: 'date',
                  label: 'Expected close date',
                  admin: { width: '50%' },
                },
                {
                  name: 'assignedTo',
                  type: 'text',
                  label: 'Assigned to',
                  admin: {
                    width: '50%',
                    description: 'Team member or yourself',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Tasks',
          fields: [
            {
              name: 'tasks',
              type: 'array',
              admin: { description: 'Checklist of deliverables and action items' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'done',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '10%' },
                    },
                    {
                      name: 'task',
                      type: 'text',
                      required: true,
                      admin: { width: '60%' },
                    },
                    {
                      name: 'dueDate',
                      type: 'date',
                      admin: { width: '30%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Notes & Files',
          fields: [
            {
              name: 'notes',
              type: 'array',
              admin: { description: 'Internal notes and updates' },
              fields: [
                {
                  name: 'note',
                  type: 'textarea',
                  required: true,
                  admin: { rows: 3 },
                },
                {
                  name: 'addedAt',
                  type: 'date',
                  admin: { readOnly: true },
                },
              ],
            },
            {
              name: 'files',
              type: 'array',
              admin: { description: 'Attach deliverables, contracts, briefs' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'History',
          fields: [
            {
              name: 'stageHistory',
              type: 'array',
              admin: {
                description: 'Auto-logged stage transitions',
                readOnly: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'from',
                      type: 'text',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'to',
                      type: 'text',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'movedAt',
                      type: 'date',
                      admin: { width: '40%' },
                    },
                  ],
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
      ({ data, originalDoc }) => {
        // Auto-log stage transitions
        if (originalDoc && data.stage && data.stage !== originalDoc.stage) {
          const history = data.stageHistory || originalDoc.stageHistory || []
          history.push({
            from: originalDoc.stage,
            to: data.stage,
            movedAt: new Date().toISOString(),
          })
          data.stageHistory = history
        }
        // Auto-timestamp notes
        if (data.notes) {
          data.notes = data.notes.map((n: any) => ({
            ...n,
            addedAt: n.addedAt || new Date().toISOString(),
          }))
        }
        return data
      },
    ],
    afterChange: [
      createAfterChangeHook({
        created: 'deal.created',
        stageChanged: 'deal.stageChanged',
        won: 'deal.won',
      }),
    ],
  },
}
