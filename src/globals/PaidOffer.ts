import type { GlobalConfig } from 'payload'

export const PaidOffer: GlobalConfig = {
  slug: 'paid-offer',
  admin: {
    description: 'The headline paid product shown on the Services page.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'The AI Ad Playbook',
    },
    {
      name: 'blurb',
      type: 'textarea',
      defaultValue:
        'My full spec-ad process, packaged. From brief to deliverable, every prompt, every tool, every edit decision.',
    },
    {
      name: 'price',
      type: 'text',
      defaultValue: 'Coming soon · waitlist',
    },
    {
      name: 'checkoutUrl',
      type: 'text',
      label: 'Checkout / waitlist URL',
      defaultValue: '',
    },
  ],
}
