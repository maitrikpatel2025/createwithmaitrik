import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

// Helper to make authenticated API calls
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

test.describe('CMS Admin Auth', () => {
  test('Login page loads', async ({ page }) => {
    const resp = await page.goto('/admin/login', { waitUntil: 'commit', timeout: 15000 })
    expect(resp?.status()).toBeLessThan(400)
    // Payload 3.x admin SPA — verify title renders (hydration may be slow in headless)
    await expect(page).toHaveTitle(/Login|Maitrik/i, { timeout: 10000 })
  })

  test('API login returns JWT', async () => {
    const token = await getToken()
    expect(token).toBeTruthy()
    expect(token.length).toBeGreaterThan(10)
  })
})

test.describe('Public API Endpoints', () => {
  test('POST /api/inquiry — valid submission', async () => {
    const resp = await fetch(`${BASE}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'API Test',
        email: 'api-test@example.com',
        serviceType: 'AI Ad Production',
        budget: '< $5k',
        message: 'E2E API test',
      }),
    })
    expect(resp.status).toBe(200)
    const data = await resp.json()
    expect(data.ok).toBe(true)

    // Cleanup
    const token = await getToken()
    const inquiries = await api(token, 'GET', '/api/inquiries?where[email][equals]=api-test@example.com')
    for (const inq of inquiries.data?.docs || []) {
      await api(token, 'DELETE', `/api/inquiries/${inq.id}`)
    }
    const contacts = await api(token, 'GET', '/api/contacts?where[email][equals]=api-test@example.com')
    for (const c of contacts.data?.docs || []) {
      await api(token, 'DELETE', `/api/contacts/${c.id}`)
    }
  })

  test('POST /api/inquiry — rejects missing fields', async () => {
    const resp = await fetch(`${BASE}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete' }),
    })
    expect(resp.status).toBe(400)
  })

  test('POST /api/subscribe — valid email', async () => {
    const resp = await fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sub-test@example.com', tag: 'newsletter' }),
    })
    // 200 if Beehiiv configured, may be 500 otherwise
    expect([200, 500]).toContain(resp.status)

    // Cleanup
    const token = await getToken()
    const contacts = await api(token, 'GET', '/api/contacts?where[email][equals]=sub-test@example.com')
    for (const c of contacts.data?.docs || []) {
      await api(token, 'DELETE', `/api/contacts/${c.id}`)
    }
  })

  test('POST /api/subscribe — rejects missing email', async () => {
    const resp = await fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: 'newsletter' }),
    })
    expect(resp.status).toBe(400)
  })

  test('Payload REST API requires auth', async () => {
    const resp = await fetch(`${BASE}/api/contacts`)
    expect([401, 403]).toContain(resp.status)
  })
})

test.describe('Contacts CRUD', () => {
  let token: string
  let contactId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (contactId) await api(token, 'DELETE', `/api/contacts/${contactId}`)
  })

  test('Create contact with full fields', async () => {
    const resp = await api(token, 'POST', '/api/contacts', {
      email: `e2e-contact-${Date.now()}@test.com`,
      name: 'E2E Contact',
      phone: '+1-555-0123',
      status: 'lead',
      tags: ['Hot Lead', 'AI Ads'],
      source: 'inquiry',
      country: 'Canada',
      city: 'Toronto',
      company: 'Test Inc',
      serviceInterest: ['AI Ad Production'],
      budget: '< $5k',
      customFields: [{ key: 'linkedin', value: 'https://linkedin.com/in/test' }],
    })
    expect(resp.status).toBe(201)
    contactId = resp.data.doc.id
  })

  test('Edit contact', async () => {
    const resp = await api(token, 'PATCH', `/api/contacts/${contactId}`, {
      phone: '+1-555-9999',
      tags: ['Hot Lead', 'AI Ads', 'VIP'],
    })
    expect(resp.status).toBe(200)
  })

  test('List contacts', async () => {
    const resp = await api(token, 'GET', '/api/contacts')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Pipelines & Deals', () => {
  let token: string
  let pipelineId: number
  let contactId: number
  let dealId: number

  test.beforeAll(async () => {
    token = await getToken()
    // Create prerequisite contact
    const c = await api(token, 'POST', '/api/contacts', {
      email: `e2e-deal-${Date.now()}@test.com`,
      name: 'Deal Test Contact',
    })
    contactId = c.data.doc.id
  })

  test.afterAll(async () => {
    if (dealId) await api(token, 'DELETE', `/api/deals/${dealId}`)
    if (pipelineId) await api(token, 'DELETE', `/api/pipelines/${pipelineId}`)
    if (contactId) await api(token, 'DELETE', `/api/contacts/${contactId}`)
  })

  test('Create pipeline with 5 stages', async () => {
    const resp = await api(token, 'POST', '/api/pipelines', {
      name: 'E2E Sales Pipeline',
      stages: [
        { name: 'Lead', color: 'blue', autoAction: 'none' },
        { name: 'Proposal', color: 'yellow', autoAction: 'none' },
        { name: 'Negotiation', color: 'orange', autoAction: 'none' },
        { name: 'Won', color: 'green', autoAction: 'mark-client' },
        { name: 'Lost', color: 'red', autoAction: 'none' },
      ],
    })
    expect(resp.status).toBe(201)
    pipelineId = resp.data.doc.id
    expect(resp.data.doc.stages).toHaveLength(5)
  })

  test('Create deal with pipeline + contact', async () => {
    const resp = await api(token, 'POST', '/api/deals', {
      title: 'E2E Test Deal',
      pipeline: pipelineId,
      stage: 'Lead',
      contact: contactId,
      value: 15000,
      priority: 'high',
      tasks: [{ task: 'Send proposal', done: false }],
      notes: [{ note: 'Initial note' }],
    })
    expect(resp.status).toBe(201)
    dealId = resp.data.doc.id
    // Note should have auto-timestamp
    expect(resp.data.doc.notes[0].addedAt).toBeTruthy()
  })

  test('Stage change logs history', async () => {
    await api(token, 'PATCH', `/api/deals/${dealId}`, { stage: 'Proposal' })
    const deal = await api(token, 'GET', `/api/deals/${dealId}`)
    expect(deal.data.stageHistory.length).toBeGreaterThanOrEqual(1)
    const last = deal.data.stageHistory[deal.data.stageHistory.length - 1]
    expect(last.from).toBe('Lead')
    expect(last.to).toBe('Proposal')
    expect(last.movedAt).toBeTruthy()
  })

  test('Multiple stage transitions tracked', async () => {
    await api(token, 'PATCH', `/api/deals/${dealId}`, { stage: 'Won' })
    const deal = await api(token, 'GET', `/api/deals/${dealId}`)
    expect(deal.data.stageHistory.length).toBeGreaterThanOrEqual(2)
  })

  test('List pipelines', async () => {
    const resp = await api(token, 'GET', '/api/pipelines')
    expect(resp.status).toBe(200)
  })

  test('List deals', async () => {
    const resp = await api(token, 'GET', '/api/deals')
    expect(resp.status).toBe(200)
  })
})

test.describe('Invoices', () => {
  let token: string
  let invoiceId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (invoiceId) await api(token, 'DELETE', `/api/invoices/${invoiceId}`)
  })

  test('Create invoice with auto-calculated totals', async () => {
    const resp = await api(token, 'POST', '/api/invoices', {
      invoiceNumber: `E2E-${Date.now()}`,
      status: 'draft',
      lineItems: [
        { description: 'AI Ad Production - 5 ads', quantity: 5, rate: 500 },
        { description: 'Strategy consultation', quantity: 2, rate: 250 },
      ],
      taxRate: 13,
      currency: 'CAD',
    })
    expect(resp.status).toBe(201)
    invoiceId = resp.data.doc.id

    const inv = resp.data.doc
    expect(inv.lineItems[0].amount).toBe(2500)
    expect(inv.lineItems[1].amount).toBe(500)
    expect(inv.subtotal).toBe(3000)
    expect(inv.taxAmount).toBe(390)
    expect(inv.total).toBe(3390)
  })

  test('Status lifecycle: draft → sent → paid', async () => {
    let resp = await api(token, 'PATCH', `/api/invoices/${invoiceId}`, { status: 'sent' })
    expect(resp.status).toBe(200)

    resp = await api(token, 'PATCH', `/api/invoices/${invoiceId}`, { status: 'paid' })
    expect(resp.status).toBe(200)

    const inv = await api(token, 'GET', `/api/invoices/${invoiceId}`)
    expect(inv.data.status).toBe('paid')
  })

  test('List invoices', async () => {
    const resp = await api(token, 'GET', '/api/invoices')
    expect(resp.status).toBe(200)
  })
})

test.describe('Campaigns', () => {
  let token: string
  let campaignId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (campaignId) await api(token, 'DELETE', `/api/campaigns/${campaignId}`)
  })

  test('Create campaign with all fields', async () => {
    const resp = await api(token, 'POST', '/api/campaigns', {
      name: 'E2E Campaign',
      platform: 'meta',
      objective: 'conversions',
      status: 'draft',
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      budget: 5000,
      utmSource: 'facebook',
      utmMedium: 'paid',
      utmCampaign: 'summer2026',
      trackingPixelId: 'pixel-e2e-123',
    })
    expect(resp.status).toBe(201)
    campaignId = resp.data.doc.id
  })

  test('Add performance data', async () => {
    const resp = await api(token, 'PATCH', `/api/campaigns/${campaignId}`, {
      impressions: 50000,
      clicks: 2500,
      spend: 1500,
      roas: 3.2,
    })
    expect(resp.status).toBe(200)

    const camp = await api(token, 'GET', `/api/campaigns/${campaignId}`)
    expect(camp.data.impressions).toBe(50000)
    expect(camp.data.roas).toBe(3.2)
  })

  test('UTM and tracking fields saved', async () => {
    const camp = await api(token, 'GET', `/api/campaigns/${campaignId}`)
    expect(camp.data.utmSource).toBe('facebook')
    expect(camp.data.trackingPixelId).toBe('pixel-e2e-123')
  })

  test('List campaigns', async () => {
    const resp = await api(token, 'GET', '/api/campaigns')
    expect(resp.status).toBe(200)
  })
})

test.describe('Team Tasks', () => {
  let token: string
  let taskId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (taskId) await api(token, 'DELETE', `/api/team-tasks/${taskId}`)
  })

  test('Create task with subtasks, time entries, comments', async () => {
    const resp = await api(token, 'POST', '/api/team-tasks', {
      title: 'E2E Task',
      status: 'todo',
      priority: 'high',
      project: 'CWM Website',
      sprint: 'Sprint 12',
      assignee: 'Maitrik',
      subtasks: [
        { title: 'Design', done: true },
        { title: 'Code', done: false },
      ],
      comments: [{ comment: 'Started work' }],
      timeEntries: [
        { date: '2026-05-22', hours: 2, description: 'Research' },
        { date: '2026-05-23', hours: 1.5, description: 'Mockup' },
      ],
    })
    expect(resp.status).toBe(201)
    taskId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.loggedHours).toBe(3.5)
    expect(doc.comments[0].postedAt).toBeTruthy()
    expect(doc.subtasks).toHaveLength(2)
  })

  test('Time entry additions recalculate loggedHours', async () => {
    const current = await api(token, 'GET', `/api/team-tasks/${taskId}`)
    const entries = current.data.timeEntries || []
    entries.push({ date: '2026-05-23', hours: 3, description: 'Coding' })

    await api(token, 'PATCH', `/api/team-tasks/${taskId}`, { timeEntries: entries })
    const updated = await api(token, 'GET', `/api/team-tasks/${taskId}`)
    expect(updated.data.loggedHours).toBe(6.5)
  })

  test('Status → done sets completedDate', async () => {
    await api(token, 'PATCH', `/api/team-tasks/${taskId}`, { status: 'done' })
    const task = await api(token, 'GET', `/api/team-tasks/${taskId}`)
    expect(task.data.completedDate).toBeTruthy()
  })

  test('List tasks', async () => {
    const resp = await api(token, 'GET', '/api/team-tasks')
    expect(resp.status).toBe(200)
  })
})

test.describe('Inquiry → CRM Flow', () => {
  let token: string
  const testEmail = `e2e-flow-${Date.now()}@test.com`

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    // Clean up inquiry
    const inqs = await api(token, 'GET', `/api/inquiries?where[email][equals]=${testEmail}`)
    for (const i of inqs.data?.docs || []) {
      await api(token, 'DELETE', `/api/inquiries/${i.id}`)
    }
    // Clean up contact
    const contacts = await api(token, 'GET', `/api/contacts?where[email][equals]=${testEmail}`)
    for (const c of contacts.data?.docs || []) {
      await api(token, 'DELETE', `/api/contacts/${c.id}`)
    }
  })

  test('Inquiry creates doc + upserts contact with Hot Lead tag', async () => {
    const resp = await fetch(`${BASE}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Flow Test',
        email: testEmail,
        serviceType: 'AI Ad Production',
        budget: '< $5k',
        message: 'Flow test',
      }),
    })
    expect(resp.status).toBe(200)

    // Wait for async CRM upsert
    await new Promise(r => setTimeout(r, 3000))

    const inqs = await api(token, 'GET', `/api/inquiries?where[email][equals]=${testEmail}`)
    expect(inqs.data.totalDocs).toBeGreaterThanOrEqual(1)

    const contacts = await api(token, 'GET', `/api/contacts?where[email][equals]=${testEmail}`)
    expect(contacts.data.totalDocs).toBeGreaterThanOrEqual(1)
    expect(contacts.data.docs[0].tags).toContain('Hot Lead')
  })
})
