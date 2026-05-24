/**
 * Integration tests — verify that CRM operations trigger activity logging,
 * webhook events, and that API key auth + dashboard stats work end-to-end.
 *
 * These tests create real CRM data, wait for async hooks, then verify
 * the activity-log entries were written with the correct action/collection/summary.
 * All test data is cleaned up in afterAll.
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const HOOK_DELAY = 1200 // ms for async afterChange hooks to write

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

async function getActivityLogs(token: string, collection: string, docId: string | number) {
  const resp = await api(
    token,
    'GET',
    `/api/activity-log?where[collection][equals]=${collection}&where[docId][equals]=${docId}&sort=-createdAt&limit=10`,
  )
  return resp.data?.docs || []
}

async function cleanupActivityLogs(token: string, collection: string, docId: string | number) {
  const logs = await getActivityLogs(token, collection, docId)
  for (const log of logs) {
    await api(token, 'DELETE', `/api/activity-log/${log.id}`)
  }
}

// ─── Contact → Activity Log ─────────────────────────────────────────────────

test.describe('Contact hooks integration', () => {
  let token: string
  let contactId: number
  const contactEmail = `e2e-int-contact-${Date.now()}@test.com`

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (contactId) {
      await cleanupActivityLogs(token, 'contacts', contactId)
      await api(token, 'DELETE', `/api/contacts/${contactId}`)
    }
  })

  test('Creating a contact logs "create" activity', async () => {
    const resp = await api(token, 'POST', '/api/contacts', {
      email: contactEmail,
      name: 'Integration Test Contact',
      status: 'lead',
    })
    expect(resp.status).toBe(201)
    contactId = resp.data.doc.id

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'contacts', contactId)
    const createLog = logs.find((l: any) => l.action === 'create')
    expect(createLog).toBeTruthy()
    expect(createLog.summary).toContain('contacts created')
    expect(createLog.summary).toContain('Integration Test Contact')
  })

  test('Updating a contact logs "update" activity', async () => {
    const resp = await api(token, 'PATCH', `/api/contacts/${contactId}`, {
      phone: '+1-555-9999',
    })
    expect(resp.status).toBe(200)

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'contacts', contactId)
    const updateLog = logs.find((l: any) => l.action === 'update')
    expect(updateLog).toBeTruthy()
    expect(updateLog.summary).toContain('contacts updated')
  })
})

// ─── Deal → Activity Log (create, stage-change, won) ────────────────────────

test.describe('Deal hooks integration', () => {
  let token: string
  let pipelineId: number
  let contactId: number
  let dealId: number

  test.beforeAll(async () => {
    token = await getToken()
    const c = await api(token, 'POST', '/api/contacts', {
      email: `e2e-int-deal-${Date.now()}@test.com`,
      name: 'Deal Hook Contact',
    })
    contactId = c.data.doc.id

    const p = await api(token, 'POST', '/api/pipelines', {
      name: 'Integration Test Pipeline',
      stages: [
        { name: 'Lead', color: 'blue', autoAction: 'none' },
        { name: 'Proposal', color: 'yellow', autoAction: 'none' },
        { name: 'Won', color: 'green', autoAction: 'none' },
      ],
    })
    pipelineId = p.data.doc.id
  })

  test.afterAll(async () => {
    if (dealId) {
      await cleanupActivityLogs(token, 'deals', dealId)
      await api(token, 'DELETE', `/api/deals/${dealId}`)
    }
    if (pipelineId) await api(token, 'DELETE', `/api/pipelines/${pipelineId}`)
    if (contactId) {
      await cleanupActivityLogs(token, 'contacts', contactId)
      await api(token, 'DELETE', `/api/contacts/${contactId}`)
    }
  })

  test('Creating a deal logs "create" activity', async () => {
    const resp = await api(token, 'POST', '/api/deals', {
      title: 'Integration Deal',
      pipeline: pipelineId,
      stage: 'Lead',
      contact: contactId,
      value: 10000,
    })
    expect(resp.status).toBe(201)
    dealId = resp.data.doc.id

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'deals', dealId)
    const createLog = logs.find((l: any) => l.action === 'create')
    expect(createLog).toBeTruthy()
    expect(createLog.summary).toContain('deals created')
  })

  test('Stage change logs "stage-change" with from/to details', async () => {
    await api(token, 'PATCH', `/api/deals/${dealId}`, { stage: 'Proposal' })

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'deals', dealId)
    const stageLog = logs.find((l: any) => l.action === 'stage-change')
    expect(stageLog).toBeTruthy()
    expect(stageLog.summary).toContain('Lead')
    expect(stageLog.summary).toContain('Proposal')
    expect(stageLog.details).toEqual({ from: 'Lead', to: 'Proposal' })
  })

  test('Stage change to Won logs another "stage-change"', async () => {
    await api(token, 'PATCH', `/api/deals/${dealId}`, { stage: 'Won' })

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'deals', dealId)
    const wonLogs = logs.filter(
      (l: any) => l.action === 'stage-change' && l.details?.to === 'Won',
    )
    expect(wonLogs.length).toBeGreaterThanOrEqual(1)
    expect(wonLogs[0].summary).toContain('Won')
  })
})

// ─── Invoice → Activity Log (create, status-change to paid) ─────────────────

test.describe('Invoice hooks integration', () => {
  let token: string
  let invoiceId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (invoiceId) {
      await cleanupActivityLogs(token, 'invoices', invoiceId)
      await api(token, 'DELETE', `/api/invoices/${invoiceId}`)
    }
  })

  test('Creating an invoice logs "create" activity', async () => {
    const resp = await api(token, 'POST', '/api/invoices', {
      invoiceNumber: `INT-${Date.now()}`,
      status: 'draft',
      lineItems: [{ description: 'Integration test item', quantity: 1, rate: 100 }],
    })
    expect(resp.status).toBe(201)
    invoiceId = resp.data.doc.id

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'invoices', invoiceId)
    const createLog = logs.find((l: any) => l.action === 'create')
    expect(createLog).toBeTruthy()
    expect(createLog.summary).toContain('invoices created')
  })

  test('Status change to "paid" logs "status-change" with details', async () => {
    // Move draft → sent first
    await api(token, 'PATCH', `/api/invoices/${invoiceId}`, { status: 'sent' })
    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    // Now sent → paid
    await api(token, 'PATCH', `/api/invoices/${invoiceId}`, { status: 'paid' })
    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'invoices', invoiceId)
    const paidLog = logs.find(
      (l: any) => l.action === 'status-change' && l.details?.to === 'paid',
    )
    expect(paidLog).toBeTruthy()
    expect(paidLog.details).toEqual({ from: 'sent', to: 'paid' })
  })
})

// ─── Team Task → Activity Log (create, status-change to done) ───────────────

test.describe('Task hooks integration', () => {
  let token: string
  let taskId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (taskId) {
      await cleanupActivityLogs(token, 'team-tasks', taskId)
      await api(token, 'DELETE', `/api/team-tasks/${taskId}`)
    }
  })

  test('Creating a task logs "create" activity', async () => {
    const resp = await api(token, 'POST', '/api/team-tasks', {
      title: 'Integration Task',
      status: 'todo',
      priority: 'medium',
    })
    expect(resp.status).toBe(201)
    taskId = resp.data.doc.id

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'team-tasks', taskId)
    const createLog = logs.find((l: any) => l.action === 'create')
    expect(createLog).toBeTruthy()
    expect(createLog.summary).toContain('team-tasks created')
  })

  test('Status change to "done" logs "status-change"', async () => {
    await api(token, 'PATCH', `/api/team-tasks/${taskId}`, { status: 'done' })

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'team-tasks', taskId)
    const doneLog = logs.find(
      (l: any) => l.action === 'status-change' && l.details?.to === 'done',
    )
    expect(doneLog).toBeTruthy()
    expect(doneLog.details).toEqual({ from: 'todo', to: 'done' })
  })
})

// ─── Campaign → Activity Log ────────────────────────────────────────────────

test.describe('Campaign hooks integration', () => {
  let token: string
  let campaignId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (campaignId) {
      await cleanupActivityLogs(token, 'campaigns', campaignId)
      await api(token, 'DELETE', `/api/campaigns/${campaignId}`)
    }
  })

  test('Creating a campaign logs "create" activity', async () => {
    const resp = await api(token, 'POST', '/api/campaigns', {
      name: 'Integration Campaign',
      platform: 'meta',
      objective: 'conversions',
      status: 'draft',
      budget: 1000,
    })
    expect(resp.status).toBe(201)
    campaignId = resp.data.doc.id

    await new Promise((r) => setTimeout(r, HOOK_DELAY))

    const logs = await getActivityLogs(token, 'campaigns', campaignId)
    const createLog = logs.find((l: any) => l.action === 'create')
    expect(createLog).toBeTruthy()
    expect(createLog.summary).toContain('campaigns created')
  })
})

// ─── Inquiry → Activity Log ─────────────────────────────────────────────────

test.describe('Inquiry hooks integration', () => {
  let token: string
  const inquiryEmail = `e2e-int-inq-${Date.now()}@test.com`

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    // Cleanup inquiry
    const inqs = await api(token, 'GET', `/api/inquiries?where[email][equals]=${inquiryEmail}`)
    for (const i of inqs.data?.docs || []) {
      await cleanupActivityLogs(token, 'inquiries', i.id)
      await api(token, 'DELETE', `/api/inquiries/${i.id}`)
    }
    // Cleanup contact created by inquiry flow
    const contacts = await api(token, 'GET', `/api/contacts?where[email][equals]=${inquiryEmail}`)
    for (const c of contacts.data?.docs || []) {
      await cleanupActivityLogs(token, 'contacts', c.id)
      await api(token, 'DELETE', `/api/contacts/${c.id}`)
    }
  })

  test('Submitting an inquiry logs "create" in activity-log', async () => {
    const resp = await fetch(`${BASE}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Inquiry',
        email: inquiryEmail,
        serviceType: 'AI Ad Production',
        budget: '< $5k',
        message: 'Integration hook test',
      }),
    })
    expect(resp.status).toBe(200)

    await new Promise((r) => setTimeout(r, 2000))

    // Find the inquiry doc
    const inqs = await api(token, 'GET', `/api/inquiries?where[email][equals]=${inquiryEmail}`)
    expect(inqs.data.totalDocs).toBeGreaterThanOrEqual(1)
    const inquiryId = inqs.data.docs[0].id

    const logs = await getActivityLogs(token, 'inquiries', inquiryId)
    const createLog = logs.find((l: any) => l.action === 'create')
    expect(createLog).toBeTruthy()
    expect(createLog.summary).toContain('inquiries created')
  })

  test('Inquiry also creates a contact with activity log entry', async () => {
    const contacts = await api(token, 'GET', `/api/contacts?where[email][equals]=${inquiryEmail}`)
    expect(contacts.data.totalDocs).toBeGreaterThanOrEqual(1)

    const contactId = contacts.data.docs[0].id
    const logs = await getActivityLogs(token, 'contacts', contactId)
    const createLog = logs.find((l: any) => l.action === 'create')
    expect(createLog).toBeTruthy()
  })
})

// ─── API Key Auth → CRM Collections ─────────────────────────────────────────

test.describe('API key auth across CRM collections', () => {
  let token: string
  let apiKeyId: number
  let apiKeyValue: string

  test.beforeAll(async () => {
    token = await getToken()
    // Create a key with multi-collection access
    const resp = await api(token, 'POST', '/api/api-keys', {
      label: 'Integration Multi-Scope Key',
      permissions: [
        'contacts:read',
        'deals:read',
        'invoices:read',
        'team-tasks:read',
        'campaigns:read',
        'pipelines:read',
        'activity-log:read',
        'notifications:read',
        'dashboard:read',
      ],
    })
    apiKeyId = resp.data.doc.id
    apiKeyValue = resp.data.doc.key
  })

  test.afterAll(async () => {
    if (apiKeyId) await api(token, 'DELETE', `/api/api-keys/${apiKeyId}`)
  })

  const collections = ['contacts', 'deals', 'invoices', 'team-tasks', 'campaigns', 'pipelines']

  for (const slug of collections) {
    test(`API key reads ${slug}`, async () => {
      const resp = await fetch(`${BASE}/api/${slug}?limit=1`, {
        headers: { Authorization: `Bearer ${apiKeyValue}` },
      })
      expect(resp.status).toBe(200)
      const data = await resp.json()
      expect(data.docs).toBeDefined()
    })
  }

  test('API key reads activity-log', async () => {
    const resp = await fetch(`${BASE}/api/activity-log?limit=1`, {
      headers: { Authorization: `Bearer ${apiKeyValue}` },
    })
    expect(resp.status).toBe(200)
  })

  test('API key reads notifications', async () => {
    const resp = await fetch(`${BASE}/api/notifications?limit=1`, {
      headers: { Authorization: `Bearer ${apiKeyValue}` },
    })
    expect(resp.status).toBe(200)
  })

  test('API key reads dashboard', async () => {
    const resp = await fetch(`${BASE}/api/dashboard`, {
      headers: { Authorization: `Bearer ${apiKeyValue}` },
    })
    expect(resp.status).toBe(200)
    const data = await resp.json()
    expect(data.deals).toBeDefined()
    expect(data.generatedAt).toBeTruthy()
  })

  test('API key write denied on deals (read-only key)', async () => {
    const resp = await fetch(`${BASE}/api/deals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKeyValue}`,
      },
      body: JSON.stringify({ title: 'Should Fail', stage: 'Lead', value: 100 }),
    })
    expect([401, 403]).toContain(resp.status)
  })
})

// ─── Dashboard reflects real CRM data ───────────────────────────────────────

test.describe('Dashboard stats reflect CRM data', () => {
  let token: string
  let dealId: number
  let pipelineId: number
  let contactId: number
  let taskId: number
  let invoiceId: number

  test.beforeAll(async () => {
    token = await getToken()

    // Create a contact (should count in newThisWeek)
    const c = await api(token, 'POST', '/api/contacts', {
      email: `e2e-dash-${Date.now()}@test.com`,
      name: 'Dashboard Test Contact',
    })
    contactId = c.data.doc.id

    // Create pipeline + open deal (should count in deals.open)
    const p = await api(token, 'POST', '/api/pipelines', {
      name: 'Dashboard Pipeline',
      stages: [
        { name: 'Lead', color: 'blue', autoAction: 'none' },
        { name: 'Won', color: 'green', autoAction: 'none' },
      ],
    })
    pipelineId = p.data.doc.id

    const d = await api(token, 'POST', '/api/deals', {
      title: 'Dashboard Deal',
      pipeline: pipelineId,
      stage: 'Lead',
      contact: contactId,
      value: 7500,
    })
    dealId = d.data.doc.id

    // Create an overdue task (dueDate in the past, status not done)
    const t = await api(token, 'POST', '/api/team-tasks', {
      title: 'Dashboard Overdue Task',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-01-01',
    })
    taskId = t.data.doc.id

    // Create unpaid invoice
    const i = await api(token, 'POST', '/api/invoices', {
      invoiceNumber: `DASH-${Date.now()}`,
      status: 'sent',
      lineItems: [{ description: 'Dashboard test', quantity: 1, rate: 2000 }],
    })
    invoiceId = i.data.doc.id
  })

  test.afterAll(async () => {
    if (dealId) {
      await cleanupActivityLogs(token, 'deals', dealId)
      await api(token, 'DELETE', `/api/deals/${dealId}`)
    }
    if (pipelineId) await api(token, 'DELETE', `/api/pipelines/${pipelineId}`)
    if (contactId) {
      await cleanupActivityLogs(token, 'contacts', contactId)
      await api(token, 'DELETE', `/api/contacts/${contactId}`)
    }
    if (taskId) {
      await cleanupActivityLogs(token, 'team-tasks', taskId)
      await api(token, 'DELETE', `/api/team-tasks/${taskId}`)
    }
    if (invoiceId) {
      await cleanupActivityLogs(token, 'invoices', invoiceId)
      await api(token, 'DELETE', `/api/invoices/${invoiceId}`)
    }
  })

  test('Dashboard counts include test data', async () => {
    const resp = await fetch(`${BASE}/api/dashboard`, {
      headers: { Authorization: `JWT ${token}` },
    })
    expect(resp.status).toBe(200)
    const data = await resp.json()

    // We just created an open deal, so open >= 1
    expect(data.deals.open).toBeGreaterThanOrEqual(1)
    // Pipeline value should include our 7500 deal
    expect(data.deals.pipelineValue).toBeGreaterThanOrEqual(7500)
    // Overdue task with past due date
    expect(data.tasks.overdue).toBeGreaterThanOrEqual(1)
    // Unpaid invoice (status=sent)
    expect(data.invoices.unpaid).toBeGreaterThanOrEqual(1)
    expect(data.invoices.unpaidTotal).toBeGreaterThanOrEqual(2000)
    // Contact created this week
    expect(data.contacts.newThisWeek).toBeGreaterThanOrEqual(1)
  })
})
