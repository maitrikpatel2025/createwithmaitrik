import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function getToken(): Promise<string> {
  const resp = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@maitrikpatel.io', password: 'changeme123' }),
  })
  const data = await resp.json()
  return data.token
}

async function api(token: string, method: string, path: string, body?: Record<string, unknown>) {
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
  }
  if (body) opts.body = JSON.stringify(body)
  const resp = await fetch(`${BASE}${path}`, opts)
  const data = await resp.json().catch(() => ({}))
  return { status: resp.status, data }
}

// ─── API Keys ────────────────────────────────────────────────────────────────

test.describe('API Keys', () => {
  let token: string
  let apiKeyId: number
  let apiKeyValue: string

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (apiKeyId) await api(token, 'DELETE', `/api/api-keys/${apiKeyId}`)
  })

  test('Create API key with auto-generated cwm_ prefix', async () => {
    const resp = await api(token, 'POST', '/api/api-keys', {
      label: 'E2E Test Key',
      permissions: ['contacts:read', 'contacts:write', 'dashboard:read'],
      rateLimit: 50,
      notes: 'Created by E2E tests',
    })
    expect(resp.status).toBe(201)
    const doc = resp.data.doc
    apiKeyId = doc.id
    apiKeyValue = doc.key

    expect(doc.key).toMatch(/^cwm_/)
    expect(doc.key.length).toBeGreaterThan(20)
    expect(doc.keyPrefix).toBe(doc.key.slice(0, 12))
    expect(doc.active).toBe(true)
    expect(doc.usageCount).toBe(0)
    expect(doc.permissions).toContain('contacts:read')
  })

  test('API key authenticates for scoped collection', async () => {
    const resp = await fetch(`${BASE}/api/contacts`, {
      headers: { Authorization: `Bearer ${apiKeyValue}` },
    })
    expect(resp.status).toBe(200)
    const data = await resp.json()
    expect(data.docs).toBeDefined()
  })

  test('API key denied for unscoped collection', async () => {
    const resp = await fetch(`${BASE}/api/deals`, {
      headers: { Authorization: `Bearer ${apiKeyValue}` },
    })
    // Should be denied — key only has contacts + dashboard
    expect([401, 403]).toContain(resp.status)
  })

  test('API key authenticates dashboard endpoint', async () => {
    const resp = await fetch(`${BASE}/api/dashboard`, {
      headers: { Authorization: `Bearer ${apiKeyValue}` },
    })
    expect(resp.status).toBe(200)
    const data = await resp.json()
    expect(data.deals).toBeDefined()
  })

  test('List API keys', async () => {
    const resp = await api(token, 'GET', '/api/api-keys')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Update API key — deactivate', async () => {
    const resp = await api(token, 'PATCH', `/api/api-keys/${apiKeyId}`, { active: false })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.active).toBe(false)
  })

  test('Deactivated key is rejected', async () => {
    const resp = await fetch(`${BASE}/api/contacts`, {
      headers: { Authorization: `Bearer ${apiKeyValue}` },
    })
    expect([401, 403]).toContain(resp.status)
  })

  test('Re-activate API key', async () => {
    const resp = await api(token, 'PATCH', `/api/api-keys/${apiKeyId}`, { active: true })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.active).toBe(true)
  })
})

// ─── Webhooks ────────────────────────────────────────────────────────────────

test.describe('Webhooks', () => {
  let token: string
  let webhookId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (webhookId) await api(token, 'DELETE', `/api/webhooks/${webhookId}`)
  })

  test('Create webhook with events and HMAC secret', async () => {
    const resp = await api(token, 'POST', '/api/webhooks', {
      label: 'E2E Webhook',
      url: 'https://httpbin.org/post',
      event: ['inquiry.created', 'deal.stageChanged', 'deal.won'],
      secret: 'e2e-test-secret-123',
      active: true,
      headers: [{ key: 'X-Test', value: 'e2e' }],
    })
    expect(resp.status).toBe(201)
    webhookId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.event).toContain('inquiry.created')
    expect(doc.event).toContain('deal.won')
    expect(doc.secret).toBe('e2e-test-secret-123')
    expect(doc.failCount).toBe(0)
    expect(doc.headers).toHaveLength(1)
  })

  test('Update webhook — change events', async () => {
    const resp = await api(token, 'PATCH', `/api/webhooks/${webhookId}`, {
      event: ['invoice.paid', 'task.completed'],
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.event).toContain('invoice.paid')
    expect(resp.data.doc.event).not.toContain('inquiry.created')
  })

  test('List webhooks', async () => {
    const resp = await api(token, 'GET', '/api/webhooks')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Webhook requires auth', async () => {
    const resp = await fetch(`${BASE}/api/webhooks`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ─── Activity Log ────────────────────────────────────────────────────────────

test.describe('Activity Log', () => {
  let token: string
  let logEntryId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (logEntryId) await api(token, 'DELETE', `/api/activity-log/${logEntryId}`)
  })

  test('Create activity log entry (open create access)', async () => {
    const resp = await fetch(`${BASE}/api/activity-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'custom',
        collection: 'e2e-test',
        docId: '999',
        actor: 'e2e-playwright',
        summary: 'E2E test log entry',
        details: { test: true },
      }),
    })
    expect(resp.status).toBe(201)
    const data = await resp.json()
    logEntryId = data.doc.id
    expect(data.doc.summary).toBe('E2E test log entry')
    expect(data.doc.actor).toBe('e2e-playwright')
  })

  test('Activity log is immutable (update returns 403)', async () => {
    const resp = await api(token, 'PATCH', `/api/activity-log/${logEntryId}`, {
      summary: 'Tampered summary',
    })
    // update access is () => false
    expect([403]).toContain(resp.status)
  })

  test('Read activity log entries', async () => {
    const resp = await api(token, 'GET', '/api/activity-log?limit=5&sort=-createdAt')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Filter activity log by collection', async () => {
    const resp = await api(token, 'GET', '/api/activity-log?where[collection][equals]=e2e-test')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Activity log requires auth to read', async () => {
    const resp = await fetch(`${BASE}/api/activity-log`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ─── Notifications ───────────────────────────────────────────────────────────

test.describe('Notifications', () => {
  let token: string
  let notificationId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (notificationId) await api(token, 'DELETE', `/api/notifications/${notificationId}`)
  })

  test('Create notification (open create access)', async () => {
    const resp = await fetch(`${BASE}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'E2E Test Notification',
        type: 'action-needed',
        message: 'This is a test notification from Playwright E2E tests.',
        relatedCollection: 'deals',
        relatedDocId: '123',
        link: '/admin/collections/deals/123',
        source: 'e2e-test',
      }),
    })
    expect(resp.status).toBe(201)
    const data = await resp.json()
    notificationId = data.doc.id

    expect(data.doc.title).toBe('E2E Test Notification')
    expect(data.doc.type).toBe('action-needed')
    expect(data.doc.read).toBe(false)
    expect(data.doc.source).toBe('e2e-test')
  })

  test('Mark notification as read', async () => {
    const resp = await api(token, 'PATCH', `/api/notifications/${notificationId}`, {
      read: true,
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.read).toBe(true)
  })

  test('List unread notifications', async () => {
    const resp = await api(token, 'GET', '/api/notifications?where[read][equals]=false')
    expect(resp.status).toBe(200)
    // Just verify the query shape works
    expect(resp.data.docs).toBeDefined()
  })

  test('Filter notifications by type', async () => {
    const resp = await api(token, 'GET', '/api/notifications?where[type][equals]=action-needed')
    expect(resp.status).toBe(200)
    expect(resp.data.docs).toBeDefined()
  })

  test('Notifications require auth to read', async () => {
    const resp = await fetch(`${BASE}/api/notifications`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

test.describe('Dashboard Stats', () => {
  let token: string

  test.beforeAll(async () => {
    token = await getToken()
  })

  test('Dashboard returns correct shape with JWT auth', async () => {
    const resp = await fetch(`${BASE}/api/dashboard`, {
      headers: { Authorization: `JWT ${token}` },
    })
    expect(resp.status).toBe(200)
    const data = await resp.json()

    expect(data.deals).toBeDefined()
    expect(typeof data.deals.open).toBe('number')
    expect(typeof data.deals.pipelineValue).toBe('number')

    expect(data.tasks).toBeDefined()
    expect(typeof data.tasks.overdue).toBe('number')

    expect(data.invoices).toBeDefined()
    expect(typeof data.invoices.unpaid).toBe('number')
    expect(typeof data.invoices.unpaidTotal).toBe('number')

    expect(data.contacts).toBeDefined()
    expect(typeof data.contacts.newThisWeek).toBe('number')

    expect(data.campaigns).toBeDefined()
    expect(typeof data.campaigns.active).toBe('number')
    expect(typeof data.campaigns.totalSpend).toBe('number')

    expect(data.generatedAt).toBeTruthy()
  })

  test('Dashboard requires auth', async () => {
    const resp = await fetch(`${BASE}/api/dashboard`)
    expect(resp.status).toBe(401)
  })

  test('Dashboard rejects invalid token', async () => {
    const resp = await fetch(`${BASE}/api/dashboard`, {
      headers: { Authorization: 'JWT invalid-token-here' },
    })
    expect(resp.status).toBe(401)
  })
})

// ─── Automations ─────────────────────────────────────────────────────────────

test.describe('Automations', () => {
  let token: string
  let automationId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (automationId) await api(token, 'DELETE', `/api/automations/${automationId}`)
  })

  test('Create automation rule', async () => {
    const resp = await api(token, 'POST', '/api/automations', {
      name: 'E2E: Inquiry → Notification',
      trigger: 'inquiry.created',
      active: true,
      priority: 5,
      conditions: { serviceType: 'AI Ad Production' },
      actions: [
        {
          type: 'create-notification',
          collection: 'notifications',
          data: { title: 'New AI Ad inquiry from {{name}}', type: 'action-needed', message: 'Review the inquiry.' },
        },
      ],
      description: 'E2E test automation',
    })
    expect(resp.status).toBe(201)
    automationId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.name).toBe('E2E: Inquiry → Notification')
    expect(doc.trigger).toBe('inquiry.created')
    expect(doc.active).toBe(true)
    expect(doc.priority).toBe(5)
    expect(doc.runCount).toBe(0)
    expect(doc.actions).toHaveLength(1)
    expect(doc.actions[0].type).toBe('create-notification')
  })

  test('Update automation — deactivate', async () => {
    const resp = await api(token, 'PATCH', `/api/automations/${automationId}`, {
      active: false,
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.active).toBe(false)
  })

  test('List automations', async () => {
    const resp = await api(token, 'GET', '/api/automations')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Automations require auth', async () => {
    const resp = await fetch(`${BASE}/api/automations`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ─── Templates ───────────────────────────────────────────────────────────────

test.describe('Templates', () => {
  let token: string
  let emailTemplateId: number
  let invoiceTemplateId: number
  let pipelineTemplateId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (emailTemplateId) await api(token, 'DELETE', `/api/templates/${emailTemplateId}`)
    if (invoiceTemplateId) await api(token, 'DELETE', `/api/templates/${invoiceTemplateId}`)
    if (pipelineTemplateId) await api(token, 'DELETE', `/api/templates/${pipelineTemplateId}`)
  })

  test('Create email template', async () => {
    const resp = await api(token, 'POST', '/api/templates', {
      name: 'E2E Follow-Up Email',
      type: 'email',
      active: true,
      description: 'Test email template',
      emailSubject: 'Thanks {{contact.name}} — next steps',
      emailBody: 'Hi {{contact.name}},\n\nThanks for reaching out about {{deal.title}}.\n\nBest,\nMaitrik',
    })
    expect(resp.status).toBe(201)
    emailTemplateId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.type).toBe('email')
    expect(doc.emailSubject).toContain('{{contact.name}}')
    expect(doc.emailBody).toContain('{{deal.title}}')
  })

  test('Create invoice template with line items', async () => {
    const resp = await api(token, 'POST', '/api/templates', {
      name: 'E2E Spec Ad Package',
      type: 'invoice',
      active: true,
      invoiceLineItems: [
        { description: 'Spec Ad Production (5 ads)', quantity: 5, rate: 500 },
        { description: 'Strategy & Creative Direction', quantity: 1, rate: 1500 },
      ],
      invoiceTaxRate: 13,
      invoiceCurrency: 'CAD',
      invoiceNotes: 'Payment due within 30 days.',
    })
    expect(resp.status).toBe(201)
    invoiceTemplateId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.type).toBe('invoice')
    expect(doc.invoiceLineItems).toHaveLength(2)
    expect(doc.invoiceTaxRate).toBe(13)
    expect(doc.invoiceCurrency).toBe('CAD')
  })

  test('Create pipeline template with stages', async () => {
    const resp = await api(token, 'POST', '/api/templates', {
      name: 'E2E Ad Production Pipeline',
      type: 'pipeline',
      active: true,
      pipelineStages: [
        { name: 'Brief', color: 'blue', autoAction: 'none' },
        { name: 'Script', color: 'yellow', autoAction: 'none' },
        { name: 'Production', color: 'orange', autoAction: 'none' },
        { name: 'Review', color: 'purple', autoAction: 'notify' },
        { name: 'Delivered', color: 'green', autoAction: 'none' },
      ],
    })
    expect(resp.status).toBe(201)
    pipelineTemplateId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.type).toBe('pipeline')
    expect(doc.pipelineStages).toHaveLength(5)
    expect(doc.pipelineStages[3].autoAction).toBe('notify')
  })

  test('Filter templates by type', async () => {
    const resp = await api(token, 'GET', '/api/templates?where[type][equals]=email')
    expect(resp.status).toBe(200)
    for (const doc of resp.data.docs) {
      expect(doc.type).toBe('email')
    }
  })

  test('List all templates', async () => {
    const resp = await api(token, 'GET', '/api/templates')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(3)
  })

  test('Templates require auth', async () => {
    const resp = await fetch(`${BASE}/api/templates`)
    expect([401, 403]).toContain(resp.status)
  })
})

// Cross-feature integration tests are in tests/integration.spec.ts
