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
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  admin: {
                    description: 'URL slug — auto-fill or type your own (lowercase-kebab-case)',
                    width: '50%',
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
                  name: 'status',
                  type: 'select',
                  options: ['draft', 'published'],
                  defaultValue: 'draft',
                  admin: { width: '25%' },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Show in the Featured Playbooks section (3 slots)',
                    width: '25%',
                  },
                },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              admin: { rows: 3 },
            },
            {
              name: 'body',
              type: 'textarea',
              admin: {
                description:
                  'Paste Claude-written Markdown here. Use [IMAGE-1], [IMAGE-2]... markers where images should appear.',
                rows: 30,
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Hero image shown at the top of the playbook and in cards',
              },
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
              name: 'pdf',
              type: 'upload',
              relationTo: 'media',
              label: 'PDF (email gate)',
              admin: {
                description: 'The gated PDF download — served when a reader enters their email',
              },
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'aiTool',
                  type: 'select',
                  admin: { width: '50%' },
                  options: ['Midjourney', 'Claude', 'ChatGPT', 'Gemini', 'Runway', 'Freepik', 'ElevenLabs', 'CapCut', 'Sora', 'Multi-Tool'],
                },
                {
                  name: 'topic',
                  type: 'select',
                  admin: { width: '50%' },
                  options: ['AI Ads', 'AI Agents', 'Built in Public'],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'readTime',
                  type: 'text',
                  admin: {
                    description: 'e.g. "6 min"',
                    width: '50%',
                  },
                },
                {
                  name: 'publishedDate',
                  type: 'date',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'SEO title',
              admin: {
                description: 'Custom title for search engines. Defaults to playbook title if empty.',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'SEO description',
              admin: {
                description: 'Meta description for search results. Keep under 160 characters.',
                rows: 3,
              },
            },
          ],
        },
      ],
    },
  ],
}
