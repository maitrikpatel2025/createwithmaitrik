import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    description: 'Tagline, statement, socials, emails — used everywhere on the public site.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Maitrik Patel',
      label: 'Site name',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Steal the Playbook.',
    },
    {
      name: 'statement',
      type: 'textarea',
      defaultValue: 'Teaching myself AI so you can steal the playbook.',
    },
    {
      name: 'pillars',
      type: 'array',
      fields: [{ name: 'label', type: 'text' }],
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Brampton, Ontario, Canada',
    },
    {
      name: 'year',
      type: 'number',
      defaultValue: 2026,
    },
    {
      name: 'domain',
      type: 'text',
      defaultValue: 'maitrikpatel.io',
    },
    {
      label: 'Contact emails',
      type: 'collapsible',
      fields: [
        { name: 'helloEmail', type: 'email', label: 'Hello email', defaultValue: 'hello@maitrikpatel.io' },
        { name: 'partnershipsEmail', type: 'email', label: 'Partnerships email', defaultValue: 'partnerships@maitrikpatel.io' },
      ],
    },
    {
      label: 'Social handles',
      type: 'collapsible',
      fields: [
        { name: 'instagram', type: 'text', defaultValue: '@createwithmaitrik' },
        { name: 'youtube', type: 'text', defaultValue: '@maitrikpatel' },
        { name: 'tiktok', type: 'text', defaultValue: '@maitrikpatel' },
        { name: 'x', type: 'text', label: 'X (Twitter)', defaultValue: '@maitrikpatel' },
        { name: 'linkedin', type: 'text', defaultValue: 'in/maitrikpatel' },
      ],
    },
    {
      label: 'Social proof numbers',
      type: 'collapsible',
      admin: {
        description: 'Toggle each stat on/off and set the value. They show on the homepage stats bar.',
      },
      fields: [
        { name: 'showIgFollowers', type: 'checkbox', label: 'Show Instagram followers', defaultValue: false },
        { name: 'igFollowers', type: 'number', label: 'Instagram followers', defaultValue: 0, admin: { condition: (_, siblingData) => siblingData?.showIgFollowers } },
        { name: 'showIgViews', type: 'checkbox', label: 'Show Instagram views', defaultValue: false },
        { name: 'igViews', type: 'number', label: 'Instagram views (28 days)', defaultValue: 0, admin: { condition: (_, siblingData) => siblingData?.showIgViews } },
        { name: 'showYtSubscribers', type: 'checkbox', label: 'Show YouTube subscribers', defaultValue: false },
        { name: 'ytSubscribers', type: 'number', label: 'YouTube subscribers', defaultValue: 0, admin: { condition: (_, siblingData) => siblingData?.showYtSubscribers } },
      ],
    },
  ],
}
