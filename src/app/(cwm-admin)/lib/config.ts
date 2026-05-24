// ───────────────────────────────────────────────────
// Admin config — mirrors the Payload collection/global
// definitions but only carries the metadata the admin
// UI needs to render forms, tables, and navigation.
// ───────────────────────────────────────────────────

export type FieldDef = {
  name: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number' | 'upload' | 'email' | 'array' | 'row' | 'collapsible'
  label?: string
  required?: boolean
  options?: string[]
  description?: string
  width?: string
  rows?: number
  relationTo?: string
  fields?: FieldDef[]
  defaultValue?: any
  readOnly?: boolean
}

export type TabDef = {
  label: string
  fields: FieldDef[]
}

export type ColumnDef = {
  name: string
  label: string
  type?: 'text' | 'status' | 'boolean' | 'date'
}

export type CollectionDef = {
  slug: string
  label: string
  labelPlural: string
  icon: string
  useAsTitle: string
  group?: string
  defaultColumns: ColumnDef[]
  tabs?: TabDef[]
  fields?: FieldDef[]
}

export type GlobalDef = {
  slug: string
  label: string
  icon: string
  description?: string
  fields: FieldDef[]
}

// ───────────────────────────────────────────────────
// Collections
// ───────────────────────────────────────────────────

export const collections: CollectionDef[] = [
  // ═══════════════════════════════════════════════════
  // CONTENT
  // ═══════════════════════════════════════════════════
  {
    slug: 'playbooks',
    label: 'Playbook',
    labelPlural: 'Playbooks',
    icon: '📖',
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: [
      { name: 'title', label: 'Title' },
      { name: 'aiTool', label: 'AI Tool' },
      { name: 'topic', label: 'Topic' },
      { name: 'status', label: 'Status', type: 'status' },
      { name: 'featured', label: 'Featured', type: 'boolean' },
    ],
    tabs: [
      {
        label: 'Content',
        fields: [
          { name: 'title', type: 'text', label: 'Title', required: true },
          {
            name: '_row_slug_status',
            type: 'row',
            fields: [
              { name: 'slug', type: 'text', label: 'Slug', required: true, width: '50%', description: 'URL slug — lowercase-kebab-case' },
              { name: 'status', type: 'select', label: 'Status', options: ['draft', 'published'], width: '25%' },
              { name: 'featured', type: 'checkbox', label: 'Featured', description: 'Show in the Featured Playbooks section (3 slots)', width: '25%' },
            ],
          },
          { name: 'summary', type: 'textarea', label: 'Summary', rows: 3 },
          { name: 'body', type: 'textarea', label: 'Body (Markdown)', rows: 30, description: 'Paste Markdown here. Use [IMAGE-1], [IMAGE-2]… markers where images should appear.' },
        ],
      },
      {
        label: 'Media',
        fields: [
          { name: 'coverImage', type: 'upload', label: 'Cover Image', relationTo: 'media', description: 'Hero image shown at the top of the playbook and in cards' },
          {
            name: 'images',
            type: 'array',
            label: 'Inline Images — bound to [IMAGE-N] markers',
            description: 'Upload images here and tag each with the matching marker key',
            fields: [
              { name: 'placeholder', type: 'text', label: 'Marker Key', description: 'e.g. IMAGE-1' },
              { name: 'image', type: 'upload', label: 'Image', relationTo: 'media', required: true },
            ],
          },
          { name: 'pdf', type: 'upload', label: 'PDF (Email Gate)', relationTo: 'media', description: 'The gated PDF download — served when a reader enters their email' },
        ],
      },
      {
        label: 'Details',
        fields: [
          {
            name: '_row_tool_topic',
            type: 'row',
            fields: [
              { name: 'aiTool', type: 'select', label: 'AI Tool', width: '50%', options: ['Midjourney', 'Claude', 'ChatGPT', 'Gemini', 'Runway', 'Freepik', 'ElevenLabs', 'CapCut', 'Sora', 'Multi-Tool'] },
              { name: 'topic', type: 'select', label: 'Topic', width: '50%', options: ['AI Ads', 'AI Agents', 'Built in Public'] },
            ],
          },
          {
            name: '_row_readtime_date',
            type: 'row',
            fields: [
              { name: 'readTime', type: 'text', label: 'Read Time', width: '50%', description: 'e.g. "6 min"' },
              { name: 'publishedDate', type: 'date', label: 'Published Date', width: '50%' },
            ],
          },
        ],
      },
      {
        label: 'SEO',
        fields: [
          { name: 'seoTitle', type: 'text', label: 'SEO Title', description: 'Custom title for search engines. Defaults to playbook title if empty.' },
          { name: 'seoDescription', type: 'textarea', label: 'SEO Description', rows: 3, description: 'Meta description for search results. Keep under 160 characters.' },
        ],
      },
    ],
  },
  {
    slug: 'tools',
    label: 'Tool',
    labelPlural: 'Tools',
    icon: '🛠️',
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: [
      { name: 'name', label: 'Name' },
      { name: 'tag', label: 'Category' },
      { name: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'oneLiner', type: 'text', label: 'One-liner', required: true },
      { name: 'affiliateUrl', type: 'text', label: 'Affiliate URL' },
      { name: 'tag', type: 'text', label: 'Category Tag', description: 'e.g. AI Ads, Audio, Agents' },
      { name: 'order', type: 'number', label: 'Sort Order', defaultValue: 99 },
    ],
  },
  {
    slug: 'services',
    label: 'Service',
    labelPlural: 'Services',
    icon: '💼',
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: [
      { name: 'title', label: 'Title' },
      { name: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'description', type: 'textarea', label: 'Description' },
      {
        name: 'deliverables',
        type: 'array',
        label: 'Deliverables',
        fields: [
          { name: 'item', type: 'text', label: 'Item' },
        ],
      },
      { name: 'order', type: 'number', label: 'Sort Order', defaultValue: 99 },
    ],
  },
  {
    slug: 'newsletter-issues',
    label: 'Newsletter Issue',
    labelPlural: 'Newsletter Issues',
    icon: '📬',
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: [
      { name: 'title', label: 'Title' },
      { name: 'issueNumber', label: 'Issue #' },
      { name: 'date', label: 'Date', type: 'date' },
    ],
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'summary', type: 'textarea', label: 'Summary' },
      { name: 'issueNumber', type: 'text', label: 'Issue #' },
      { name: 'date', type: 'date', label: 'Date' },
      { name: 'externalUrl', type: 'text', label: 'Link to Issue', description: 'URL of the issue in the email tool (ConvertKit/Beehiiv)' },
    ],
  },
  {
    slug: 'spec-ads',
    label: 'Spec Ad',
    labelPlural: 'Spec Ads',
    icon: '🎬',
    group: 'Content',
    useAsTitle: 'brand',
    defaultColumns: [
      { name: 'brand', label: 'Brand' },
      { name: 'tag', label: 'Tag', type: 'status' },
      { name: 'order', label: 'Order' },
      { name: 'enabled', label: 'Enabled', type: 'boolean' },
    ],
    fields: [
      { name: 'brand', type: 'text', label: 'Brand', required: true },
      { name: 'tag', type: 'select', label: 'Tag', options: ['Spec', 'Concept', 'Paid', 'Collab'], defaultValue: 'Spec' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'thumbnail', type: 'upload', label: 'Thumbnail', relationTo: 'media' },
      { name: 'video', type: 'upload', label: 'Video', relationTo: 'media' },
      { name: 'externalVideoUrl', type: 'text', label: 'External Video URL' },
      { name: 'order', type: 'number', label: 'Sort Order', defaultValue: 0 },
      { name: 'enabled', type: 'checkbox', label: 'Enabled', defaultValue: true },
    ],
  },
  {
    slug: 'inquiries',
    label: 'Inquiry',
    labelPlural: 'Inquiries',
    icon: '📩',
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'serviceType', label: 'Service Type' },
      { name: 'budget', label: 'Budget' },
      { name: 'submittedAt', label: 'Submitted', type: 'date' },
    ],
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true, readOnly: true },
      { name: 'email', type: 'email', label: 'Email', required: true, readOnly: true },
      { name: 'serviceType', type: 'select', label: 'Service Type', readOnly: true, options: ['AI Ad Production', 'AI Agent & Automation Builds', 'Built-in-Public Coaching', 'Not sure yet'] },
      { name: 'budget', type: 'select', label: 'Budget', readOnly: true, options: ['< $5k', '$5k – $15k', '$15k – $50k', '$50k+'] },
      { name: 'message', type: 'textarea', label: 'Message', readOnly: true },
      { name: 'submittedAt', type: 'date', label: 'Submitted At', readOnly: true },
    ],
  },

  // ═══════════════════════════════════════════════════
  // CRM
  // ═══════════════════════════════════════════════════
  {
    slug: 'contacts',
    label: 'Contact',
    labelPlural: 'Contacts',
    icon: '👥',
    group: 'CRM',
    useAsTitle: 'email',
    defaultColumns: [
      { name: 'email', label: 'Email' },
      { name: 'name', label: 'Name' },
      { name: 'firstName', label: 'First Name' },
      { name: 'status', label: 'Status', type: 'status' },
      { name: 'source', label: 'Source' },
      { name: 'leadScore', label: 'Score' },
    ],
    tabs: [
      {
        label: 'Contact',
        fields: [
          {
            name: '_row_names',
            type: 'row',
            fields: [
              { name: 'firstName', type: 'text', label: 'First Name', width: '25%' },
              { name: 'lastName', type: 'text', label: 'Last Name', width: '25%' },
              { name: 'email', type: 'email', label: 'Email', required: true, width: '25%' },
              { name: 'phone', type: 'text', label: 'Phone', width: '25%' },
            ],
          },
          {
            name: '_row_meta',
            type: 'row',
            fields: [
              { name: 'name', type: 'text', label: 'Display Name', width: '25%' },
              { name: 'jobTitle', type: 'text', label: 'Job Title', width: '25%' },
              { name: 'company', type: 'text', label: 'Company', width: '25%' },
              { name: 'companyRef', type: 'number', label: 'Company ID', width: '25%', description: 'Link to Companies collection' },
            ],
          },
          {
            name: '_row_status',
            type: 'row',
            fields: [
              { name: 'status', type: 'select', label: 'Status', width: '33%', options: ['lead', 'subscriber', 'prospect', 'client', 'partner', 'archived'], defaultValue: 'lead' },
              { name: 'source', type: 'select', label: 'Source', width: '33%', options: ['newsletter', 'lead-magnet', 'inquiry', 'partnership', 'ad', 'referral', 'manual', 'api'] },
              { name: 'dateOfBirth', type: 'date', label: 'Date of Birth', width: '33%' },
            ],
          },
          { name: 'tags', type: 'select', label: 'Tags', options: ['AI Ads', 'AI Agents', 'Built in Public', 'Coaching', 'Newsletter', 'Lead Magnet', 'Hot Lead', 'VIP', 'Meta Ads', 'Google Ads', 'TikTok Ads'], description: 'Select primary tag' },
        ],
      },
      {
        label: 'Location',
        fields: [
          {
            name: '_row_location',
            type: 'row',
            fields: [
              { name: 'country', type: 'text', label: 'Country', width: '33%' },
              { name: 'city', type: 'text', label: 'City', width: '33%' },
              { name: 'state', type: 'text', label: 'State/Province', width: '33%' },
            ],
          },
          {
            name: '_row_address',
            type: 'row',
            fields: [
              { name: 'postalCode', type: 'text', label: 'Postal Code', width: '30%' },
              { name: 'address', type: 'text', label: 'Address', width: '70%' },
            ],
          },
        ],
      },
      {
        label: 'Business',
        fields: [
          { name: 'serviceInterest', type: 'select', label: 'Service Interest', options: ['AI Ad Production', 'AI Agent & Automation Builds', 'Built-in-Public Coaching'], description: 'Primary service interest' },
          {
            name: '_row_biz',
            type: 'row',
            fields: [
              { name: 'budget', type: 'select', label: 'Budget', width: '33%', options: ['< $5k', '$5k – $15k', '$15k – $50k', '$50k+'] },
              { name: 'industry', type: 'text', label: 'Industry', width: '33%' },
              { name: 'website', type: 'text', label: 'Website', width: '33%' },
            ],
          },
          { name: 'adPlatform', type: 'select', label: 'Ad Platform', options: ['meta', 'google', 'tiktok', 'youtube', 'linkedin'], description: 'Primary ad platform' },
          { name: 'notes', type: 'textarea', label: 'Notes', rows: 4 },
        ],
      },
      {
        label: 'Social & Identity',
        fields: [
          {
            name: '_row_social1',
            type: 'row',
            fields: [
              { name: 'linkedin', type: 'text', label: 'LinkedIn', width: '50%' },
              { name: 'twitter', type: 'text', label: 'Twitter / X', width: '50%' },
            ],
          },
          {
            name: '_row_social2',
            type: 'row',
            fields: [
              { name: 'instagram', type: 'text', label: 'Instagram', width: '50%' },
              { name: 'facebook', type: 'text', label: 'Facebook', width: '50%' },
            ],
          },
          {
            name: '_row_identity',
            type: 'row',
            fields: [
              { name: 'timezone', type: 'text', label: 'Timezone', width: '33%' },
              { name: 'preferredLanguage', type: 'text', label: 'Preferred Language', width: '33%' },
            ],
          },
          { name: 'profilePhoto', type: 'upload', label: 'Profile Photo', relationTo: 'media' },
        ],
      },
      {
        label: 'Scoring & Lifecycle',
        fields: [
          {
            name: '_row_scoring',
            type: 'row',
            fields: [
              { name: 'leadScore', type: 'number', label: 'Lead Score (0-100)', width: '25%', defaultValue: 0 },
              { name: 'lifecycleStage', type: 'select', label: 'Lifecycle Stage', width: '25%', options: ['visitor', 'lead', 'mql', 'sql', 'opportunity', 'customer', 'evangelist'], defaultValue: 'visitor' },
              { name: 'preferredContactMethod', type: 'select', label: 'Preferred Contact', width: '25%', options: ['email', 'phone', 'sms', 'whatsapp'] },
              { name: 'referredBy', type: 'number', label: 'Referred By (Contact ID)', width: '25%' },
            ],
          },
          { name: 'lastContactedAt', type: 'date', label: 'Last Contacted', readOnly: true },
        ],
      },
      {
        label: 'Consent',
        fields: [
          {
            name: '_row_consent',
            type: 'row',
            fields: [
              { name: 'emailOptIn', type: 'checkbox', label: 'Email Opt-In', width: '25%' },
              { name: 'smsOptIn', type: 'checkbox', label: 'SMS Opt-In', width: '25%' },
              { name: 'callOptIn', type: 'checkbox', label: 'Call Opt-In', width: '25%' },
              { name: 'doNotDisturb', type: 'checkbox', label: 'Do Not Disturb', width: '25%' },
            ],
          },
        ],
      },
      {
        label: 'Custom Fields',
        fields: [
          {
            name: 'customFields',
            type: 'array',
            label: 'Custom Fields',
            fields: [
              { name: 'key', type: 'text', label: 'Key', required: true },
              { name: 'value', type: 'text', label: 'Value', required: true },
            ],
          },
        ],
      },
      {
        label: 'Activity',
        fields: [
          {
            name: 'activity',
            type: 'array',
            label: 'Activity Log',
            fields: [
              { name: 'action', type: 'text', label: 'Action', readOnly: true },
              { name: 'detail', type: 'text', label: 'Detail', readOnly: true },
              { name: 'timestamp', type: 'date', label: 'Timestamp', readOnly: true },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'companies',
    label: 'Company',
    labelPlural: 'Companies',
    icon: '🏢',
    group: 'CRM',
    useAsTitle: 'name',
    defaultColumns: [
      { name: 'name', label: 'Name' },
      { name: 'industry', label: 'Industry' },
      { name: 'size', label: 'Size' },
      { name: 'email', label: 'Email' },
    ],
    tabs: [
      {
        label: 'Company',
        fields: [
          {
            name: '_row_names',
            type: 'row',
            fields: [
              { name: 'name', type: 'text', label: 'Company Name', required: true, width: '50%' },
              { name: 'legalName', type: 'text', label: 'Legal Name', width: '50%' },
            ],
          },
          {
            name: '_row_details',
            type: 'row',
            fields: [
              { name: 'industry', type: 'text', label: 'Industry', width: '33%' },
              { name: 'size', type: 'select', label: 'Size', width: '33%', options: ['1-10', '11-50', '51-200', '201-500', '500+'] },
              { name: 'revenue', type: 'select', label: 'Revenue', width: '33%', options: ['<1M', '1M-10M', '10M-50M', '50M+'] },
            ],
          },
          {
            name: '_row_contact_info',
            type: 'row',
            fields: [
              { name: 'phone', type: 'text', label: 'Phone', width: '33%' },
              { name: 'email', type: 'email', label: 'Email', width: '33%' },
              { name: 'website', type: 'text', label: 'Website', width: '33%' },
            ],
          },
          { name: 'description', type: 'textarea', label: 'Description', rows: 3 },
          { name: 'tags', type: 'select', label: 'Tags', options: ['enterprise', 'smb', 'startup', 'agency', 'ai', 'ecommerce', 'saas', 'media'], description: 'Primary tag' },
        ],
      },
      {
        label: 'Address',
        fields: [
          {
            name: '_address',
            type: 'collapsible',
            label: 'Main Address',
            fields: [
              { name: 'address.street', type: 'text', label: 'Street' },
              {
                name: '_row_addr1',
                type: 'row',
                fields: [
                  { name: 'address.city', type: 'text', label: 'City', width: '33%' },
                  { name: 'address.state', type: 'text', label: 'State', width: '33%' },
                  { name: 'address.postalCode', type: 'text', label: 'Postal Code', width: '33%' },
                ],
              },
              { name: 'address.country', type: 'text', label: 'Country' },
            ],
          },
          {
            name: '_billing_address',
            type: 'collapsible',
            label: 'Billing Address',
            fields: [
              { name: 'billingAddress.street', type: 'text', label: 'Street' },
              {
                name: '_row_billing1',
                type: 'row',
                fields: [
                  { name: 'billingAddress.city', type: 'text', label: 'City', width: '33%' },
                  { name: 'billingAddress.state', type: 'text', label: 'State', width: '33%' },
                  { name: 'billingAddress.postalCode', type: 'text', label: 'Postal Code', width: '33%' },
                ],
              },
              { name: 'billingAddress.country', type: 'text', label: 'Country' },
            ],
          },
        ],
      },
      {
        label: 'Financial',
        fields: [
          {
            name: '_row_fin',
            type: 'row',
            fields: [
              { name: 'taxId', type: 'text', label: 'Tax ID', width: '33%' },
              { name: 'registrationNumber', type: 'text', label: 'Registration #', width: '33%' },
              { name: 'currency', type: 'select', label: 'Currency', width: '33%', options: ['CAD', 'USD', 'INR', 'GBP', 'EUR'] },
            ],
          },
          { name: 'paymentTerms', type: 'select', label: 'Payment Terms', options: ['net-15', 'net-30', 'net-45', 'net-60', 'due-on-receipt'] },
          { name: 'bankDetails', type: 'textarea', label: 'Bank Details', rows: 3 },
        ],
      },
      {
        label: 'Social',
        fields: [
          {
            name: '_row_social',
            type: 'row',
            fields: [
              { name: 'linkedin', type: 'text', label: 'LinkedIn', width: '50%' },
              { name: 'twitter', type: 'text', label: 'Twitter / X', width: '50%' },
            ],
          },
          {
            name: '_row_social2',
            type: 'row',
            fields: [
              { name: 'instagram', type: 'text', label: 'Instagram', width: '50%' },
              { name: 'facebook', type: 'text', label: 'Facebook', width: '50%' },
            ],
          },
        ],
      },
      {
        label: 'Relationships',
        fields: [
          {
            name: '_row_rels',
            type: 'row',
            fields: [
              { name: 'primaryContact', type: 'number', label: 'Primary Contact ID', width: '50%', description: 'Link to Contacts' },
            ],
          },
          { name: 'notes', type: 'textarea', label: 'Notes', rows: 4 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // SALES
  // ═══════════════════════════════════════════════════
  {
    slug: 'pipelines',
    label: 'Pipeline',
    labelPlural: 'Pipelines',
    icon: '🔀',
    group: 'Sales',
    useAsTitle: 'name',
    defaultColumns: [
      { name: 'name', label: 'Name' },
      { name: 'active', label: 'Active', type: 'boolean' },
    ],
    fields: [
      { name: 'name', type: 'text', label: 'Pipeline Name', required: true },
      { name: 'description', type: 'textarea', label: 'Description', rows: 2 },
      { name: 'active', type: 'checkbox', label: 'Active', defaultValue: true },
      {
        name: 'stages',
        type: 'array',
        label: 'Stages',
        required: true,
        fields: [
          {
            name: '_row_stage',
            type: 'row',
            fields: [
              { name: 'name', type: 'text', label: 'Stage Name', required: true, width: '40%' },
              { name: 'color', type: 'select', label: 'Color', width: '30%', options: ['gray', 'blue', 'green', 'yellow', 'orange', 'red', 'purple'], defaultValue: 'gray' },
              { name: 'autoAction', type: 'select', label: 'Auto Action', width: '30%', options: ['none', 'notify', 'mark-client'], defaultValue: 'none' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'deals',
    label: 'Deal',
    labelPlural: 'Deals',
    icon: '🤝',
    group: 'Sales',
    useAsTitle: 'title',
    defaultColumns: [
      { name: 'title', label: 'Title' },
      { name: 'stage', label: 'Stage', type: 'status' },
      { name: 'value', label: 'Value' },
      { name: 'priority', label: 'Priority', type: 'status' },
      { name: 'expectedClose', label: 'Expected Close', type: 'date' },
    ],
    tabs: [
      {
        label: 'Deal',
        fields: [
          { name: 'title', type: 'text', label: 'Deal Title', required: true },
          {
            name: '_row_deal1',
            type: 'row',
            fields: [
              { name: 'pipeline', type: 'number', label: 'Pipeline ID', required: true, width: '33%', description: 'Link to Pipelines' },
              { name: 'stage', type: 'text', label: 'Stage', required: true, width: '33%' },
              { name: 'contact', type: 'number', label: 'Contact ID', width: '33%', description: 'Link to Contacts' },
            ],
          },
          {
            name: '_row_deal2',
            type: 'row',
            fields: [
              { name: 'value', type: 'number', label: 'Value ($)', width: '25%' },
              { name: 'priority', type: 'select', label: 'Priority', width: '25%', options: ['low', 'medium', 'high', 'urgent'], defaultValue: 'medium' },
              { name: 'expectedClose', type: 'date', label: 'Expected Close', width: '25%' },
              { name: 'assignedTo', type: 'text', label: 'Assigned To', width: '25%' },
            ],
          },
          { name: 'description', type: 'textarea', label: 'Description', rows: 3 },
        ],
      },
      {
        label: 'Tasks',
        fields: [
          {
            name: 'tasks',
            type: 'array',
            label: 'Deal Tasks',
            fields: [
              { name: 'done', type: 'checkbox', label: 'Done' },
              { name: 'task', type: 'text', label: 'Task', required: true },
              { name: 'dueDate', type: 'date', label: 'Due Date' },
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
            label: 'Notes',
            fields: [
              { name: 'note', type: 'textarea', label: 'Note', required: true, rows: 3 },
              { name: 'addedAt', type: 'date', label: 'Added At', readOnly: true },
            ],
          },
          {
            name: 'files',
            type: 'array',
            label: 'Files',
            fields: [
              { name: 'label', type: 'text', label: 'Label' },
              { name: 'file', type: 'upload', label: 'File', relationTo: 'media' },
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
            label: 'Stage History',
            fields: [
              { name: 'from', type: 'text', label: 'From', readOnly: true },
              { name: 'to', type: 'text', label: 'To', readOnly: true },
              { name: 'movedAt', type: 'date', label: 'Moved At', readOnly: true },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'invoices',
    label: 'Invoice',
    labelPlural: 'Invoices',
    icon: '🧾',
    group: 'Sales',
    useAsTitle: 'invoiceNumber',
    defaultColumns: [
      { name: 'invoiceNumber', label: 'Invoice #' },
      { name: 'status', label: 'Status', type: 'status' },
      { name: 'total', label: 'Total' },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
    ],
    tabs: [
      {
        label: 'Invoice',
        fields: [
          {
            name: '_row_inv1',
            type: 'row',
            fields: [
              { name: 'invoiceNumber', type: 'text', label: 'Invoice #', required: true, width: '25%' },
              { name: 'status', type: 'select', label: 'Status', required: true, width: '25%', options: ['draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled'], defaultValue: 'draft' },
              { name: 'type', type: 'select', label: 'Type', width: '25%', options: ['quote', 'invoice', 'receipt'], defaultValue: 'invoice' },
              { name: 'currency', type: 'select', label: 'Currency', width: '25%', options: ['CAD', 'USD', 'INR', 'GBP', 'EUR'], defaultValue: 'CAD' },
            ],
          },
          {
            name: '_row_inv2',
            type: 'row',
            fields: [
              { name: 'contact', type: 'number', label: 'Contact ID', width: '33%', description: 'Link to Contacts' },
              { name: 'company', type: 'number', label: 'Company ID', width: '33%', description: 'Link to Companies' },
              { name: 'deal', type: 'number', label: 'Deal ID', width: '33%', description: 'Link to Deals' },
            ],
          },
          {
            name: '_row_dates',
            type: 'row',
            fields: [
              { name: 'issueDate', type: 'date', label: 'Issue Date', width: '33%' },
              { name: 'dueDate', type: 'date', label: 'Due Date', width: '33%' },
              { name: 'paidDate', type: 'date', label: 'Paid Date', width: '33%' },
            ],
          },
        ],
      },
      {
        label: 'Line Items',
        fields: [
          {
            name: 'lineItems',
            type: 'array',
            label: 'Line Items',
            fields: [
              {
                name: '_row_li',
                type: 'row',
                fields: [
                  { name: 'description', type: 'text', label: 'Description', required: true, width: '50%' },
                  { name: 'quantity', type: 'number', label: 'Qty', width: '15%', defaultValue: 1 },
                  { name: 'rate', type: 'number', label: 'Rate', width: '15%' },
                  { name: 'amount', type: 'number', label: 'Amount', width: '20%', readOnly: true },
                ],
              },
            ],
          },
          {
            name: '_row_totals',
            type: 'row',
            fields: [
              { name: 'subtotal', type: 'number', label: 'Subtotal', width: '20%', readOnly: true },
              { name: 'taxRate', type: 'number', label: 'Tax Rate (%)', width: '20%', defaultValue: 13 },
              { name: 'taxAmount', type: 'number', label: 'Tax Amount', width: '20%', readOnly: true },
              { name: 'discount', type: 'number', label: 'Discount', width: '20%' },
              { name: 'total', type: 'number', label: 'Total', width: '20%', readOnly: true },
            ],
          },
        ],
      },
      {
        label: 'Payment',
        fields: [
          {
            name: '_row_pay',
            type: 'row',
            fields: [
              { name: 'paymentMethod', type: 'select', label: 'Payment Method', width: '33%', options: ['etransfer', 'stripe', 'paypal', 'wire', 'cash', 'other'] },
              { name: 'deposit', type: 'number', label: 'Deposit', width: '33%' },
              { name: 'discountType', type: 'select', label: 'Discount Type', width: '33%', options: ['percentage', 'flat'], defaultValue: 'percentage' },
            ],
          },
          { name: 'stripePaymentLink', type: 'text', label: 'Stripe Payment Link' },
          {
            name: '_row_recurring',
            type: 'row',
            fields: [
              { name: 'recurring', type: 'checkbox', label: 'Recurring', width: '25%' },
              { name: 'recurringInterval', type: 'select', label: 'Interval', width: '25%', options: ['weekly', 'biweekly', 'monthly', 'quarterly', 'annually'] },
              { name: 'nextInvoiceDate', type: 'date', label: 'Next Invoice Date', width: '25%' },
              { name: 'viewedAt', type: 'date', label: 'Viewed At', width: '25%', readOnly: true },
            ],
          },
          { name: 'notes', type: 'textarea', label: 'Notes / Terms', rows: 3 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════
  {
    slug: 'team-tasks',
    label: 'Task',
    labelPlural: 'Team Tasks',
    icon: '✅',
    group: 'Operations',
    useAsTitle: 'title',
    defaultColumns: [
      { name: 'title', label: 'Title' },
      { name: 'assignee', label: 'Assignee' },
      { name: 'status', label: 'Status', type: 'status' },
      { name: 'priority', label: 'Priority', type: 'status' },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
    ],
    tabs: [
      {
        label: 'Task',
        fields: [
          { name: 'title', type: 'text', label: 'Task Title', required: true },
          {
            name: '_row_task1',
            type: 'row',
            fields: [
              { name: 'status', type: 'select', label: 'Status', required: true, width: '25%', options: ['backlog', 'todo', 'in-progress', 'in-review', 'qa', 'done', 'blocked', 'cancelled'], defaultValue: 'backlog' },
              { name: 'priority', type: 'select', label: 'Priority', width: '25%', options: ['low', 'medium', 'high', 'critical'], defaultValue: 'medium' },
              { name: 'taskType', type: 'select', label: 'Type', width: '25%', options: ['task', 'bug', 'feature', 'improvement', 'research', 'devops', 'design', 'meeting'], defaultValue: 'task' },
              { name: 'storyPoints', type: 'select', label: 'Points', width: '25%', options: ['1', '2', '3', '5', '8', '13'] },
            ],
          },
          {
            name: '_row_task2',
            type: 'row',
            fields: [
              { name: 'assignee', type: 'text', label: 'Assignee', width: '25%' },
              { name: 'project', type: 'text', label: 'Project', width: '25%' },
              { name: 'sprint', type: 'text', label: 'Sprint', width: '25%' },
              { name: 'deal', type: 'number', label: 'Deal ID', width: '25%', description: 'Link to Deals' },
            ],
          },
          {
            name: '_row_task3',
            type: 'row',
            fields: [
              { name: 'startDate', type: 'date', label: 'Start Date', width: '33%' },
              { name: 'dueDate', type: 'date', label: 'Due Date', width: '33%' },
              { name: 'completedDate', type: 'date', label: 'Completed', width: '33%' },
            ],
          },
          { name: 'description', type: 'textarea', label: 'Description', rows: 4 },
          { name: 'tags', type: 'select', label: 'Tags', options: ['frontend', 'backend', 'devops', 'design', 'content', 'seo', 'ads', 'email', 'analytics', 'client-work', 'internal', 'urgent'], description: 'Primary tag' },
        ],
      },
      {
        label: 'Subtasks',
        fields: [
          {
            name: 'subtasks',
            type: 'array',
            label: 'Subtasks',
            fields: [
              { name: 'done', type: 'checkbox', label: 'Done' },
              { name: 'title', type: 'text', label: 'Title', required: true },
              { name: 'assignee', type: 'text', label: 'Assignee' },
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
            label: 'Comments',
            fields: [
              { name: 'author', type: 'text', label: 'Author', readOnly: true },
              { name: 'comment', type: 'textarea', label: 'Comment', required: true, rows: 3 },
              { name: 'postedAt', type: 'date', label: 'Posted At', readOnly: true },
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
            label: 'Attachments',
            fields: [
              { name: 'label', type: 'text', label: 'Label' },
              { name: 'file', type: 'upload', label: 'File', relationTo: 'media' },
            ],
          },
        ],
      },
      {
        label: 'Time Tracking',
        fields: [
          {
            name: '_row_time',
            type: 'row',
            fields: [
              { name: 'estimatedHours', type: 'number', label: 'Estimated Hours', width: '33%' },
              { name: 'loggedHours', type: 'number', label: 'Logged Hours', width: '33%' },
              { name: 'billable', type: 'checkbox', label: 'Billable', width: '33%' },
            ],
          },
          {
            name: 'timeEntries',
            type: 'array',
            label: 'Time Entries',
            fields: [
              {
                name: '_row_te',
                type: 'row',
                fields: [
                  { name: 'date', type: 'date', label: 'Date', required: true, width: '25%' },
                  { name: 'hours', type: 'number', label: 'Hours', required: true, width: '25%' },
                  { name: 'person', type: 'text', label: 'Person', width: '25%' },
                  { name: 'description', type: 'text', label: 'Description', width: '25%' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'appointments',
    label: 'Appointment',
    labelPlural: 'Appointments',
    icon: '📅',
    group: 'Operations',
    useAsTitle: 'title',
    defaultColumns: [
      { name: 'title', label: 'Title' },
      { name: 'type', label: 'Type' },
      { name: 'status', label: 'Status', type: 'status' },
      { name: 'startTime', label: 'Start Time', type: 'date' },
    ],
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      {
        name: '_row_apt1',
        type: 'row',
        fields: [
          { name: 'type', type: 'select', label: 'Type', required: true, width: '25%', options: ['call', 'meeting', 'demo', 'consultation', 'follow-up'] },
          { name: 'status', type: 'select', label: 'Status', required: true, width: '25%', options: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'], defaultValue: 'scheduled' },
          { name: 'startTime', type: 'date', label: 'Start Time', required: true, width: '25%' },
          { name: 'endTime', type: 'date', label: 'End Time', width: '25%' },
        ],
      },
      {
        name: '_row_apt2',
        type: 'row',
        fields: [
          { name: 'contact', type: 'number', label: 'Contact ID', width: '25%', description: 'Link to Contacts' },
          { name: 'company', type: 'number', label: 'Company ID', width: '25%', description: 'Link to Companies' },
          { name: 'deal', type: 'number', label: 'Deal ID', width: '25%', description: 'Link to Deals' },
          { name: 'duration', type: 'number', label: 'Duration (min)', width: '25%' },
        ],
      },
      { name: 'location', type: 'text', label: 'Location' },
      { name: 'notes', type: 'textarea', label: 'Notes', rows: 3 },
      {
        name: '_row_apt3',
        type: 'row',
        fields: [
          { name: 'bookedBy', type: 'text', label: 'Booked By', width: '33%' },
          { name: 'reminderSent', type: 'checkbox', label: 'Reminder Sent', width: '33%' },
        ],
      },
      { name: 'googleCalendarId', type: 'text', label: 'Google Calendar ID' },
      { name: 'outlookCalendarId', type: 'text', label: 'Outlook Calendar ID' },
    ],
  },

  // ═══════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════
  {
    slug: 'media',
    label: 'Media',
    labelPlural: 'Media',
    icon: '🖼️',
    group: 'Admin',
    useAsTitle: 'filename',
    defaultColumns: [
      { name: 'filename', label: 'Filename' },
      { name: 'alt', label: 'Alt Text' },
      { name: 'mimeType', label: 'Type' },
    ],
    fields: [
      { name: 'alt', type: 'text', label: 'Alt Text' },
    ],
  },
  {
    slug: 'users',
    label: 'User',
    labelPlural: 'Users',
    icon: '👤',
    group: 'Admin',
    useAsTitle: 'email',
    defaultColumns: [
      { name: 'email', label: 'Email' },
      { name: 'name', label: 'Name' },
      { name: 'role', label: 'Role' },
    ],
    fields: [
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'name', type: 'text', label: 'Name' },
      { name: 'role', type: 'select', label: 'Role', options: ['admin', 'editor'], defaultValue: 'admin' },
      { name: 'password', type: 'text', label: 'Password', description: 'Leave blank to keep existing password' },
    ],
  },
]

// ───────────────────────────────────────────────────
// Sidebar group ordering
// ───────────────────────────────────────────────────

export const sidebarGroups = ['Content', 'CRM', 'Sales', 'Operations', 'Admin']

// ───────────────────────────────────────────────────
// Globals
// ───────────────────────────────────────────────────

export const globals: GlobalDef[] = [
  {
    slug: 'site-settings',
    label: 'Site Settings',
    icon: '⚙️',
    description: 'Tagline, statement, socials, emails — used everywhere on the public site.',
    fields: [
      { name: 'name', type: 'text', label: 'Site Name', defaultValue: 'Maitrik Patel' },
      { name: 'tagline', type: 'text', label: 'Tagline', defaultValue: 'Steal the Playbook.' },
      { name: 'statement', type: 'textarea', label: 'Statement' },
      {
        name: 'pillars',
        type: 'array',
        label: 'Pillars',
        fields: [
          { name: 'label', type: 'text', label: 'Pillar' },
        ],
      },
      { name: 'location', type: 'text', label: 'Location' },
      { name: 'year', type: 'number', label: 'Year' },
      { name: 'domain', type: 'text', label: 'Domain' },
      {
        name: '_contact_emails',
        type: 'collapsible',
        label: 'Contact Emails',
        fields: [
          { name: 'helloEmail', type: 'email', label: 'Hello Email' },
          { name: 'partnershipsEmail', type: 'email', label: 'Partnerships Email' },
        ],
      },
      {
        name: '_social_handles',
        type: 'collapsible',
        label: 'Social Handles',
        fields: [
          { name: 'instagram', type: 'text', label: 'Instagram' },
          { name: 'youtube', type: 'text', label: 'YouTube' },
          { name: 'tiktok', type: 'text', label: 'TikTok' },
          { name: 'x', type: 'text', label: 'X (Twitter)' },
          { name: 'linkedin', type: 'text', label: 'LinkedIn' },
        ],
      },
    ],
  },
  {
    slug: 'lead-magnet',
    label: 'Lead Magnet',
    icon: '🧲',
    description: 'The free PDF lead magnet + ConvertKit form binding.',
    fields: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'blurb', type: 'textarea', label: 'Blurb' },
      {
        name: 'bullets',
        type: 'array',
        label: 'Bullets',
        fields: [
          { name: 'item', type: 'text', label: 'Bullet' },
        ],
      },
      { name: 'pdf', type: 'upload', label: 'Lead Magnet PDF', relationTo: 'media', description: 'Upload the PDF here. It will be served after email capture.' },
      { name: 'emailFormId', type: 'text', label: 'Email Form / Tag ID', description: 'ConvertKit form ID or Beehiiv tag' },
    ],
  },
  {
    slug: 'paid-offer',
    label: 'Paid Offer',
    icon: '💰',
    description: 'The headline paid product shown on the Services page.',
    fields: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'blurb', type: 'textarea', label: 'Blurb' },
      { name: 'price', type: 'text', label: 'Price' },
      { name: 'checkoutUrl', type: 'text', label: 'Checkout / Waitlist URL' },
    ],
  },
  {
    slug: 'media-kit-stats',
    label: 'Media Kit Stats',
    icon: '📊',
    description: 'The four proof-of-work stat cards on the Partnerships page.',
    fields: [
      {
        name: 'stats',
        type: 'array',
        label: 'Stats',
        fields: [
          { name: 'value', type: 'text', label: 'Value', description: 'e.g. $2.3M or 47' },
          { name: 'label', type: 'text', label: 'Label' },
        ],
      },
    ],
  },
]

// ───────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────

export function getCollectionDef(slug: string): CollectionDef | undefined {
  return collections.find(c => c.slug === slug)
}

export function getGlobalDef(slug: string): GlobalDef | undefined {
  return globals.find(g => g.slug === slug)
}

export function getAllFields(def: CollectionDef): FieldDef[] {
  if (def.fields) return def.fields
  if (def.tabs) return def.tabs.flatMap(t => t.fields)
  return []
}

export function getCollectionsByGroup(): { group: string; items: CollectionDef[] }[] {
  const grouped: Record<string, CollectionDef[]> = {}
  for (const col of collections) {
    const g = col.group || 'Other'
    if (!grouped[g]) grouped[g] = []
    grouped[g].push(col)
  }
  return sidebarGroups
    .filter(g => grouped[g]?.length)
    .map(g => ({ group: g, items: grouped[g] }))
}
