import type { CollectionConfig } from 'payload'

export const SpecAds: CollectionConfig = {
  slug: 'spec-ads',
  admin: {
    description: 'Spec / concept ad work to showcase on the site. Supports video and image.',
    defaultColumns: ['brand', 'tag', 'order', 'enabled'],
    useAsTitle: 'brand',
  },
  fields: [
    { name: 'brand', type: 'text', required: true, label: 'Brand name (e.g. Burberry, boAt)' },
    { name: 'tag', type: 'select', options: ['Spec', 'Concept', 'Paid', 'Collab'], defaultValue: 'Spec', label: 'Type' },
    { name: 'description', type: 'textarea', label: 'Short description (optional)' },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail image',
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      label: 'Video file (optional)',
    },
    { name: 'externalVideoUrl', type: 'text', label: 'External video URL (YouTube, Vimeo — optional)' },
    { name: 'order', type: 'number', defaultValue: 0, label: 'Sort order' },
    { name: 'enabled', type: 'checkbox', defaultValue: true, label: 'Show on site' },
  ],
}
