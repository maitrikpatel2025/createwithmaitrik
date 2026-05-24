import type { CollectionConfig } from 'payload'
import { createAfterChangeHook } from '../lib/collectionHooks'
import { authOrApiKey } from '../lib/accessControl'

export const TeamTasks: CollectionConfig = {
  slug: 'team-tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'assignee', 'status', 'priority', 'dueDate', 'project', 'updatedAt'],
    description: 'Track tasks, sprints, and work items — DevOps-style task management.',
  },
  access: {
    read: authOrApiKey('team-tasks', 'read'),
    create: authOrApiKey('team-tasks', 'write'),
    update: authOrApiKey('team-tasks', 'write'),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Task',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'backlog',
                  options: [
                    { label: 'Backlog', value: 'backlog' },
                    { label: 'To Do', value: 'todo' },
                    { label: 'In Progress', value: 'in-progress' },
                    { label: 'In Review', value: 'in-review' },
                    { label: 'QA', value: 'qa' },
                    { label: 'Done', value: 'done' },
                    { label: 'Blocked', value: 'blocked' },
                    { label: 'Cancelled', value: 'cancelled' },
                  ],
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
                    { label: 'Critical', value: 'critical' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'taskType',
                  type: 'select',
                  defaultValue: 'task',
                  options: [
                    { label: 'Task', value: 'task' },
                    { label: 'Bug', value: 'bug' },
                    { label: 'Feature', value: 'feature' },
                    { label: 'Improvement', value: 'improvement' },
                    { label: 'Research', value: 'research' },
                    { label: 'DevOps', value: 'devops' },
                    { label: 'Design', value: 'design' },
                    { label: 'Meeting', value: 'meeting' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'storyPoints',
                  type: 'select',
                  options: [
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '5', value: '5' },
                    { label: '8', value: '8' },
                    { label: '13', value: '13' },
                  ],
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'assignee',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'Team member name',
                  },
                },
                {
                  name: 'project',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'e.g. CWM Website, Flowbotics, Client XYZ',
                  },
                },
                {
                  name: 'sprint',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'e.g. Sprint 12, Week 22',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dueDate',
                  type: 'date',
                  admin: { width: '33%' },
                },
                {
                  name: 'startDate',
                  type: 'date',
                  admin: { width: '33%' },
                },
                {
                  name: 'completedDate',
                  type: 'date',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { rows: 4 },
            },
            {
              name: 'deal',
              type: 'relationship',
              relationTo: 'deals',
              admin: { description: 'Link to a deal/project if applicable' },
            },
            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Frontend', value: 'frontend' },
                { label: 'Backend', value: 'backend' },
                { label: 'DevOps', value: 'devops' },
                { label: 'Design', value: 'design' },
                { label: 'Content', value: 'content' },
                { label: 'SEO', value: 'seo' },
                { label: 'Ads', value: 'ads' },
                { label: 'Email', value: 'email' },
                { label: 'Analytics', value: 'analytics' },
                { label: 'Client Work', value: 'client-work' },
                { label: 'Internal', value: 'internal' },
                { label: 'Urgent', value: 'urgent' },
              ],
            },
          ],
        },
        {
          label: 'Subtasks',
          fields: [
            {
              name: 'subtasks',
              type: 'array',
              admin: { description: 'Break down the task into smaller items' },
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
                      name: 'title',
                      type: 'text',
                      required: true,
                      admin: { width: '60%' },
                    },
                    {
                      name: 'assignee',
                      type: 'text',
                      admin: { width: '30%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Comments',
          fields: [
            {
              name: 'comments',
              type: 'array',
              admin: { description: 'Discussion and updates' },
              fields: [
                {
                  name: 'author',
                  type: 'text',
                  admin: { readOnly: true },
                },
                {
                  name: 'comment',
                  type: 'textarea',
                  required: true,
                  admin: { rows: 3 },
                },
                {
                  name: 'postedAt',
                  type: 'date',
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },
        {
          label: 'Attachments',
          fields: [
            {
              name: 'attachments',
              type: 'array',
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
          label: 'Time Tracking',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'estimatedHours',
                  type: 'number',
                  label: 'Estimated hours',
                  admin: { width: '33%' },
                },
                {
                  name: 'loggedHours',
                  type: 'number',
                  label: 'Logged hours',
                  admin: { width: '33%' },
                },
                {
                  name: 'billable',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'timeEntries',
              type: 'array',
              admin: { description: 'Log time spent on this task' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'hours',
                      type: 'number',
                      required: true,
                      admin: { width: '15%' },
                    },
                    {
                      name: 'person',
                      type: 'text',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'description',
                      type: 'text',
                      admin: { width: '35%' },
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
        // Auto-timestamp comments
        if (data.comments) {
          data.comments = data.comments.map((c: any) => ({
            ...c,
            postedAt: c.postedAt || new Date().toISOString(),
          }))
        }
        // Auto-set completedDate when status changes to done
        if (data.status === 'done' && originalDoc?.status !== 'done') {
          data.completedDate = new Date().toISOString()
        }
        // Auto-sum logged hours from time entries
        if (data.timeEntries?.length) {
          data.loggedHours = data.timeEntries.reduce(
            (sum: number, entry: any) => sum + (entry.hours || 0),
            0,
          )
        }
        return data
      },
    ],
    afterChange: [
      createAfterChangeHook({
        created: 'task.created',
        statusChanged: 'task.statusChanged',
        completed: 'task.completed',
      }),
    ],
  },
}
