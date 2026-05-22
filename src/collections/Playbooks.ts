import type { CollectionConfig } from 'payload'

export const Playbooks: CollectionConfig = {
  slug: 'playbooks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'aiTool', 'topic', 'status', 'featured'],
    description: 'The blog posts. Paste from Claude, bind images, publish.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug — auto-fill or type your own (lowercase-kebab-case)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description:
          'Paste Claude-written Markdown here. Use [IMAGE-1], [IMAGE-2]... markers where images should appear. Fenced code blocks render as copy-to-clipboard boxes.',
        rows: 30,
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Inline images — bound to [IMAGE-N] markers',
      admin: {
        description: 'Upload images here and tag each with the matching marker key (IMAGE-1, IMAGE-2…)',
      },
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          label: 'Marker key',
          admin: {
            description: 'Must match the marker in the body exactly — e.g. IMAGE-1',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'aiTool',
      type: 'select',
      options: ['Midjourney', 'Claude', 'ChatGPT', 'Gemini', 'Runway', 'Freepik', 'ElevenLabs', 'CapCut', 'Sora', 'Multi-Tool'],
    },
    {
      name: 'topic',
      type: 'select',
      options: ['AI Ads', 'AI Agents', 'Built in Public'],
    },
    {
      name: 'readTime',
      type: 'text',
      admin: {
        description: 'e.g. "6 min"',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in the Featured Playbooks section on the home page (3 slots)',
      },
    },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF (email gate)',
      admin: {
        description: 'The gated PDF download — served when a reader enters their email',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO title',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'SEO description',
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
    },
  ],
}
