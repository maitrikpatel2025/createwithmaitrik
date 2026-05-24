import type { GlobalConfig } from 'payload'

export const LinkInBio: GlobalConfig = {
  slug: 'link-in-bio',
  admin: {
    description: 'Manage your link-in-bio page (/links). Drag to reorder.',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'I build with AI. Ads. Workflows. Agents. All in public.',
      label: 'Bio tagline',
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      labels: { singular: 'Link', plural: 'Links' },
      admin: {
        description: 'Add, remove, or reorder your bio links. The first highlighted link will stand out.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Title' },
        { name: 'desc', type: 'text', label: 'Short description' },
        { name: 'href', type: 'text', required: true, label: 'URL (e.g. /playbooks or https://...)' },
        { name: 'emoji', type: 'text', label: 'Emoji', defaultValue: '🔗' },
        { name: 'highlight', type: 'checkbox', label: 'Highlight (blue card)', defaultValue: false },
        { name: 'enabled', type: 'checkbox', label: 'Show this link', defaultValue: true },
      ],
    },
  ],
}
