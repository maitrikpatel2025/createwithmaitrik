/**
 * TDD tests for CRM v2 — written BEFORE the code.
 * Covers: 9 new collections, 3 enhancements, expanded dashboard.
 * All tests are ephemeral: create → verify → cleanup.
 */
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

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #10 — Companies
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Companies', () => {
  let token: string
  let companyId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (companyId) await api(token, 'DELETE', `/api/companies/${companyId}`)
  })

  test('Create company with full fields', async () => {
    const resp = await api(token, 'POST', '/api/companies', {
      name: 'E2E Corp',
      legalName: 'E2E Corporation Inc.',
      industry: 'Technology',
      size: '11-50',
      revenue: '1M-10M',
      phone: '+1-555-0100',
      email: 'info@e2ecorp.test',
      website: 'https://e2ecorp.test',
      description: 'Test company for E2E',
      address: { street: '123 Test St', city: 'Toronto', state: 'ON', postalCode: 'M5V 1A1', country: 'Canada' },
      billingAddress: { street: '456 Bill Ave', city: 'Toronto', state: 'ON', postalCode: 'M5V 2B2', country: 'Canada' },
      taxId: 'CA-123456789',
      paymentTerms: 'net-30',
      currency: 'CAD',
      tags: ['enterprise', 'ai'],
    })
    expect(resp.status).toBe(201)
    companyId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.name).toBe('E2E Corp')
    expect(doc.legalName).toBe('E2E Corporation Inc.')
    expect(doc.industry).toBe('Technology')
    expect(doc.address.city).toBe('Toronto')
    expect(doc.billingAddress.street).toBe('456 Bill Ave')
    expect(doc.taxId).toBe('CA-123456789')
  })

  test('Update company', async () => {
    const resp = await api(token, 'PATCH', `/api/companies/${companyId}`, {
      size: '51-200',
      revenue: '10M-50M',
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.size).toBe('51-200')
  })

  test('List companies', async () => {
    const resp = await api(token, 'GET', '/api/companies')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Companies require auth', async () => {
    const resp = await fetch(`${BASE}/api/companies`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #22 — Communication Log
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Communication Log', () => {
  let token: string
  let logId: number
  let contactId: number

  test.beforeAll(async () => {
    token = await getToken()
    const c = await api(token, 'POST', '/api/contacts', {
      email: `e2e-comm-${Date.now()}@test.com`,
      name: 'Comm Log Contact',
    })
    contactId = c.data.doc.id
  })

  test.afterAll(async () => {
    if (logId) await api(token, 'DELETE', `/api/communication-log/${logId}`)
    if (contactId) await api(token, 'DELETE', `/api/contacts/${contactId}`)
  })

  test('Create email communication log', async () => {
    const resp = await api(token, 'POST', '/api/communication-log', {
      type: 'email',
      contact: contactId,
      direction: 'outbound',
      subject: 'E2E Test Email',
      body: 'This is a test email body.',
      status: 'sent',
      channel: 'gmail',
      tags: ['follow-up'],
    })
    expect(resp.status).toBe(201)
    logId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.type).toBe('email')
    expect(doc.direction).toBe('outbound')
    expect(doc.subject).toBe('E2E Test Email')
    expect(doc.status).toBe('sent')
  })

  test('Create call log with AI fields', async () => {
    const resp = await api(token, 'POST', '/api/communication-log', {
      type: 'call',
      contact: contactId,
      direction: 'outbound',
      duration: 300,
      status: 'completed',
      aiCallSummary: 'Client interested in AI ad package',
      aiSentiment: 'positive',
      aiActionItems: 'Send proposal by Friday',
    })
    expect(resp.status).toBe(201)
    const doc = resp.data.doc
    expect(doc.type).toBe('call')
    expect(doc.duration).toBe(300)
    expect(doc.aiCallSummary).toBe('Client interested in AI ad package')
    expect(doc.aiSentiment).toBe('positive')
    // Cleanup
    await api(token, 'DELETE', `/api/communication-log/${doc.id}`)
  })

  test('List communication logs', async () => {
    const resp = await api(token, 'GET', '/api/communication-log')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Filter by type', async () => {
    const resp = await api(token, 'GET', '/api/communication-log?where[type][equals]=email')
    expect(resp.status).toBe(200)
    for (const doc of resp.data.docs) {
      expect(doc.type).toBe('email')
    }
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/communication-log`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #23 — AI Agents
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('AI Agents', () => {
  let token: string
  let agentId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (agentId) await api(token, 'DELETE', `/api/ai-agents/${agentId}`)
  })

  test('Create AI agent with full config', async () => {
    const resp = await api(token, 'POST', '/api/ai-agents', {
      name: 'E2E Sales Agent',
      agentType: 'outbound-caller',
      voiceProvider: 'elevenlabs',
      voiceId: 'voice-123',
      language: 'en-US',
      systemPrompt: 'You are a sales agent for CWM.',
      greetingScript: 'Hi, this is Sarah from Create With Maitrik.',
      goal: 'Book a consultation call',
      maxDuration: 300,
      transferNumber: '+1-555-0200',
      transferConditions: 'When client is ready to buy',
      webhookUrl: 'https://hook.example.com/agent',
      active: true,
      workingHours: [
        { day: 'monday', start: '09:00', end: '17:00' },
        { day: 'tuesday', start: '09:00', end: '17:00' },
      ],
      objectionHandling: [
        { objection: 'Too expensive', response: 'Let me explain our ROI guarantee...' },
      ],
    })
    expect(resp.status).toBe(201)
    agentId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.name).toBe('E2E Sales Agent')
    expect(doc.agentType).toBe('outbound-caller')
    expect(doc.voiceProvider).toBe('elevenlabs')
    expect(doc.active).toBe(true)
    expect(doc.workingHours).toHaveLength(2)
    expect(doc.objectionHandling).toHaveLength(1)
  })

  test('Update agent — deactivate', async () => {
    const resp = await api(token, 'PATCH', `/api/ai-agents/${agentId}`, { active: false })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.active).toBe(false)
  })

  test('List AI agents', async () => {
    const resp = await api(token, 'GET', '/api/ai-agents')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/ai-agents`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #24 — AI Call Queue
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('AI Call Queue', () => {
  let token: string
  let queueId: number
  let contactId: number

  test.beforeAll(async () => {
    token = await getToken()
    const c = await api(token, 'POST', '/api/contacts', {
      email: `e2e-queue-${Date.now()}@test.com`,
      name: 'Queue Contact',
    })
    contactId = c.data.doc.id
  })

  test.afterAll(async () => {
    if (queueId) await api(token, 'DELETE', `/api/ai-call-queue/${queueId}`)
    if (contactId) await api(token, 'DELETE', `/api/contacts/${contactId}`)
  })

  test('Create call queue entry', async () => {
    const resp = await api(token, 'POST', '/api/ai-call-queue', {
      contact: contactId,
      priority: 1,
      status: 'pending',
      scheduledFor: '2026-06-01T10:00:00Z',
      maxAttempts: 3,
      retryInterval: 60,
      callContext: { reason: 'Follow up on inquiry', dealValue: 15000 },
    })
    expect(resp.status).toBe(201)
    queueId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.priority).toBe(1)
    expect(doc.status).toBe('pending')
    expect(doc.maxAttempts).toBe(3)
    expect(doc.callContext).toEqual({ reason: 'Follow up on inquiry', dealValue: 15000 })
  })

  test('Update queue status to completed', async () => {
    const resp = await api(token, 'PATCH', `/api/ai-call-queue/${queueId}`, {
      status: 'completed',
      result: 'answered',
      attemptCount: 1,
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.status).toBe('completed')
    expect(resp.data.doc.result).toBe('answered')
  })

  test('List queue', async () => {
    const resp = await api(token, 'GET', '/api/ai-call-queue')
    expect(resp.status).toBe(200)
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/ai-call-queue`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #25 — Sequences
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Sequences', () => {
  let token: string
  let sequenceId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (sequenceId) await api(token, 'DELETE', `/api/sequences/${sequenceId}`)
  })

  test('Create sequence with steps', async () => {
    const resp = await api(token, 'POST', '/api/sequences', {
      name: 'E2E Inquiry Nurture',
      description: 'Follow up with new inquiries',
      trigger: 'inquiry-created',
      status: 'active',
      steps: [
        { type: 'email', waitDuration: 0, skipCondition: null },
        { type: 'wait', waitDuration: 1440 },
        { type: 'email', waitDuration: 0 },
        { type: 'wait', waitDuration: 2880 },
        { type: 'call', waitDuration: 0 },
      ],
    })
    expect(resp.status).toBe(201)
    sequenceId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.name).toBe('E2E Inquiry Nurture')
    expect(doc.trigger).toBe('inquiry-created')
    expect(doc.status).toBe('active')
    expect(doc.steps).toHaveLength(5)
    expect(doc.enrolledCount).toBe(0)
    expect(doc.completedCount).toBe(0)
  })

  test('Update sequence — pause', async () => {
    const resp = await api(token, 'PATCH', `/api/sequences/${sequenceId}`, {
      status: 'paused',
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.status).toBe('paused')
  })

  test('List sequences', async () => {
    const resp = await api(token, 'GET', '/api/sequences')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/sequences`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #26 — Appointments
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Appointments', () => {
  let token: string
  let appointmentId: number
  let contactId: number

  test.beforeAll(async () => {
    token = await getToken()
    const c = await api(token, 'POST', '/api/contacts', {
      email: `e2e-appt-${Date.now()}@test.com`,
      name: 'Appointment Contact',
    })
    contactId = c.data.doc.id
  })

  test.afterAll(async () => {
    if (appointmentId) await api(token, 'DELETE', `/api/appointments/${appointmentId}`)
    if (contactId) await api(token, 'DELETE', `/api/contacts/${contactId}`)
  })

  test('Create appointment', async () => {
    const resp = await api(token, 'POST', '/api/appointments', {
      title: 'E2E Consultation',
      contact: contactId,
      type: 'consultation',
      startTime: '2026-06-15T14:00:00Z',
      endTime: '2026-06-15T15:00:00Z',
      duration: 60,
      location: 'Google Meet',
      status: 'scheduled',
      notes: 'Discuss AI ad package',
      bookedBy: 'admin',
    })
    expect(resp.status).toBe(201)
    appointmentId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.title).toBe('E2E Consultation')
    expect(doc.type).toBe('consultation')
    expect(doc.duration).toBe(60)
    expect(doc.status).toBe('scheduled')
  })

  test('Update appointment status', async () => {
    const resp = await api(token, 'PATCH', `/api/appointments/${appointmentId}`, {
      status: 'confirmed',
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.status).toBe('confirmed')
  })

  test('List appointments', async () => {
    const resp = await api(token, 'GET', '/api/appointments')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Filter upcoming appointments', async () => {
    const resp = await api(token, 'GET', `/api/appointments?where[startTime][greater_than]=${new Date().toISOString()}`)
    expect(resp.status).toBe(200)
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/appointments`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #27 — Forms
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Forms', () => {
  let token: string
  let formId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (formId) await api(token, 'DELETE', `/api/forms/${formId}`)
  })

  test('Create form with dynamic fields', async () => {
    const resp = await api(token, 'POST', '/api/forms', {
      name: 'E2E Contact Form',
      slug: `e2e-form-${Date.now()}`,
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'phone', required: false },
        { name: 'service', type: 'select', required: true, options: 'AI Ads, AI Agents, Coaching' },
        { name: 'message', type: 'textarea', required: false },
      ],
      submitAction: 'create-contact',
      notificationEmail: 'admin@maitrikpatel.io',
    })
    expect(resp.status).toBe(201)
    formId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.name).toBe('E2E Contact Form')
    expect(doc.fields).toHaveLength(5)
    expect(doc.submitAction).toBe('create-contact')
    expect(doc.submissionCount).toBe(0)
  })

  test('Update form', async () => {
    const resp = await api(token, 'PATCH', `/api/forms/${formId}`, {
      notificationEmail: 'team@maitrikpatel.io',
    })
    expect(resp.status).toBe(200)
  })

  test('List forms', async () => {
    const resp = await api(token, 'GET', '/api/forms')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/forms`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #28 — Proposals
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Proposals', () => {
  let token: string
  let proposalId: number
  let contactId: number

  test.beforeAll(async () => {
    token = await getToken()
    const c = await api(token, 'POST', '/api/contacts', {
      email: `e2e-prop-${Date.now()}@test.com`,
      name: 'Proposal Contact',
    })
    contactId = c.data.doc.id
  })

  test.afterAll(async () => {
    if (proposalId) await api(token, 'DELETE', `/api/proposals/${proposalId}`)
    if (contactId) await api(token, 'DELETE', `/api/contacts/${contactId}`)
  })

  test('Create proposal with sections and pricing', async () => {
    const resp = await api(token, 'POST', '/api/proposals', {
      title: 'E2E AI Ad Package Proposal',
      contact: contactId,
      coverPage: {
        headline: 'AI-Powered Ad Production',
        subtitle: 'Custom spec ads for your brand',
      },
      sections: [
        { title: 'Overview', content: 'We will produce 5 AI-powered spec ads.', order: 1 },
        { title: 'Timeline', content: '2 weeks from kickoff to delivery.', order: 2 },
      ],
      pricingTable: [
        { description: 'Spec Ad Production (5 ads)', quantity: 5, rate: 500 },
        { description: 'Strategy & Direction', quantity: 1, rate: 1500 },
      ],
      terms: 'Payment due within 30 days of acceptance.',
      validityDays: 30,
      status: 'draft',
      sentVia: 'email',
    })
    expect(resp.status).toBe(201)
    proposalId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.title).toBe('E2E AI Ad Package Proposal')
    expect(doc.coverPage.headline).toBe('AI-Powered Ad Production')
    expect(doc.sections).toHaveLength(2)
    expect(doc.pricingTable).toHaveLength(2)
    expect(doc.validityDays).toBe(30)
    expect(doc.status).toBe('draft')
  })

  test('Status lifecycle: draft → sent → viewed → accepted', async () => {
    await api(token, 'PATCH', `/api/proposals/${proposalId}`, { status: 'sent' })
    await api(token, 'PATCH', `/api/proposals/${proposalId}`, {
      status: 'viewed',
      viewedAt: new Date().toISOString(),
    })
    const resp = await api(token, 'PATCH', `/api/proposals/${proposalId}`, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.status).toBe('accepted')
    expect(resp.data.doc.acceptedAt).toBeTruthy()
  })

  test('List proposals', async () => {
    const resp = await api(token, 'GET', '/api/proposals')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/proposals`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// NEW COLLECTION #29 — Reviews
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Reviews', () => {
  let token: string
  let reviewId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (reviewId) await api(token, 'DELETE', `/api/reviews/${reviewId}`)
  })

  test('Create review', async () => {
    const resp = await api(token, 'POST', '/api/reviews', {
      platform: 'google',
      rating: 5,
      reviewText: 'Amazing AI ad production — exceeded our expectations!',
      reviewUrl: 'https://g.co/review/e2e-test',
      status: 'new',
      datePosted: '2026-05-20',
    })
    expect(resp.status).toBe(201)
    reviewId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.platform).toBe('google')
    expect(doc.rating).toBe(5)
    expect(doc.status).toBe('new')
  })

  test('Add response to review', async () => {
    const resp = await api(token, 'PATCH', `/api/reviews/${reviewId}`, {
      responseText: 'Thank you for the kind words!',
      status: 'responded',
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.responseText).toBe('Thank you for the kind words!')
    expect(resp.data.doc.status).toBe('responded')
  })

  test('List reviews', async () => {
    const resp = await api(token, 'GET', '/api/reviews')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })

  test('Filter by platform', async () => {
    const resp = await api(token, 'GET', '/api/reviews?where[platform][equals]=google')
    expect(resp.status).toBe(200)
  })

  test('Requires auth', async () => {
    const resp = await fetch(`${BASE}/api/reviews`)
    expect([401, 403]).toContain(resp.status)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCEMENT — Contacts (new fields)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Contacts Enhancements', () => {
  let token: string
  let contactId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (contactId) await api(token, 'DELETE', `/api/contacts/${contactId}`)
  })

  test('Create contact with all new enhanced fields', async () => {
    const resp = await api(token, 'POST', '/api/contacts', {
      email: `e2e-enhanced-${Date.now()}@test.com`,
      name: 'Enhanced Contact',
      firstName: 'Jane',
      lastName: 'Doe',
      jobTitle: 'VP Marketing',
      dateOfBirth: '1990-05-15',
      timezone: 'America/Toronto',
      preferredLanguage: 'en',
      linkedin: 'https://linkedin.com/in/janedoe',
      twitter: 'https://twitter.com/janedoe',
      instagram: 'https://instagram.com/janedoe',
      leadScore: 85,
      lifecycleStage: 'sql',
      emailOptIn: true,
      smsOptIn: false,
      callOptIn: true,
      doNotDisturb: false,
      preferredContactMethod: 'email',
    })
    expect(resp.status).toBe(201)
    contactId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.firstName).toBe('Jane')
    expect(doc.lastName).toBe('Doe')
    expect(doc.jobTitle).toBe('VP Marketing')
    expect(doc.leadScore).toBe(85)
    expect(doc.lifecycleStage).toBe('sql')
    expect(doc.emailOptIn).toBe(true)
    expect(doc.smsOptIn).toBe(false)
    expect(doc.preferredContactMethod).toBe('email')
    expect(doc.linkedin).toBe('https://linkedin.com/in/janedoe')
  })

  test('Company relationship works', async () => {
    // Create a company first
    const comp = await api(token, 'POST', '/api/companies', {
      name: 'Contact Enhancement Test Co',
      industry: 'Marketing',
    })
    const companyId = comp.data.doc.id

    const resp = await api(token, 'PATCH', `/api/contacts/${contactId}`, {
      companyRef: companyId,
    })
    expect(resp.status).toBe(200)

    // Verify relationship stored
    const contact = await api(token, 'GET', `/api/contacts/${contactId}`)
    expect(contact.data.companyRef).toBeTruthy()

    // Cleanup
    await api(token, 'DELETE', `/api/companies/${companyId}`)
  })

  test('Referred-by self-relationship works', async () => {
    // Create referrer contact
    const ref = await api(token, 'POST', '/api/contacts', {
      email: `e2e-referrer-${Date.now()}@test.com`,
      name: 'Referrer',
    })
    const referrerId = ref.data.doc.id

    const resp = await api(token, 'PATCH', `/api/contacts/${contactId}`, {
      referredBy: referrerId,
    })
    expect(resp.status).toBe(200)

    const contact = await api(token, 'GET', `/api/contacts/${contactId}`)
    expect(contact.data.referredBy).toBeTruthy()

    // Cleanup
    await api(token, 'DELETE', `/api/contacts/${referrerId}`)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCEMENT — Invoices (new fields)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Invoices Enhancements', () => {
  let token: string
  let invoiceId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (invoiceId) await api(token, 'DELETE', `/api/invoices/${invoiceId}`)
  })

  test('Create invoice with discount and deposit', async () => {
    const resp = await api(token, 'POST', '/api/invoices', {
      invoiceNumber: `ENH-${Date.now()}`,
      status: 'draft',
      lineItems: [
        { description: 'AI Ad Package', quantity: 5, rate: 500 },
      ],
      discount: 10,
      discountType: 'percentage',
      deposit: 500,
      stripePaymentLink: 'https://buy.stripe.com/test_e2e',
    })
    expect(resp.status).toBe(201)
    invoiceId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.discount).toBe(10)
    expect(doc.discountType).toBe('percentage')
    expect(doc.deposit).toBe(500)
    expect(doc.stripePaymentLink).toBe('https://buy.stripe.com/test_e2e')
  })

  test('Recurring invoice fields', async () => {
    const resp = await api(token, 'PATCH', `/api/invoices/${invoiceId}`, {
      recurring: true,
      recurringInterval: 'monthly',
      nextInvoiceDate: '2026-07-01',
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.recurring).toBe(true)
    expect(resp.data.doc.recurringInterval).toBe('monthly')
  })

  test('Viewed timestamp', async () => {
    const now = new Date().toISOString()
    const resp = await api(token, 'PATCH', `/api/invoices/${invoiceId}`, {
      viewedAt: now,
    })
    expect(resp.status).toBe(200)
    expect(resp.data.doc.viewedAt).toBeTruthy()
  })

  test('Company relationship on invoice', async () => {
    const comp = await api(token, 'POST', '/api/companies', {
      name: 'Invoice Test Co',
      industry: 'Finance',
    })
    const companyId = comp.data.doc.id

    const resp = await api(token, 'PATCH', `/api/invoices/${invoiceId}`, {
      company: companyId,
    })
    expect(resp.status).toBe(200)

    // Cleanup
    await api(token, 'DELETE', `/api/companies/${companyId}`)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCEMENT — Templates (new fields)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Templates Enhancements', () => {
  let token: string
  let templateId: number

  test.beforeAll(async () => {
    token = await getToken()
  })

  test.afterAll(async () => {
    if (templateId) await api(token, 'DELETE', `/api/templates/${templateId}`)
  })

  test('Create email template with category and sequence fields', async () => {
    const resp = await api(token, 'POST', '/api/templates', {
      name: 'E2E Enhanced Template',
      type: 'email',
      active: true,
      category: 'follow-up',
      emailSubject: 'Follow up: {{contact.name}}',
      emailBody: 'Hi {{contact.name}}, just checking in.',
      sendDelay: 30,
      sequenceOrder: 2,
      sequenceGroup: 'inquiry-nurture',
    })
    expect(resp.status).toBe(201)
    templateId = resp.data.doc.id

    const doc = resp.data.doc
    expect(doc.category).toBe('follow-up')
    expect(doc.sendDelay).toBe(30)
    expect(doc.sequenceOrder).toBe(2)
    expect(doc.sequenceGroup).toBe('inquiry-nurture')
  })

  test('Filter by category', async () => {
    const resp = await api(token, 'GET', '/api/templates?where[category][equals]=follow-up')
    expect(resp.status).toBe(200)
    expect(resp.data.totalDocs).toBeGreaterThanOrEqual(1)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCEMENT — Dashboard (expanded stats)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Dashboard Expanded', () => {
  let token: string

  test.beforeAll(async () => {
    token = await getToken()
  })

  test('Dashboard includes new stats fields', async () => {
    const resp = await fetch(`${BASE}/api/dashboard`, {
      headers: { Authorization: `JWT ${token}` },
    })
    expect(resp.status).toBe(200)
    const data = await resp.json()

    // Existing fields still work
    expect(data.deals).toBeDefined()
    expect(data.tasks).toBeDefined()
    expect(data.invoices).toBeDefined()
    expect(data.contacts).toBeDefined()
    expect(data.campaigns).toBeDefined()

    // New expanded fields
    expect(data.appointments).toBeDefined()
    expect(typeof data.appointments.upcoming).toBe('number')

    expect(data.notifications).toBeDefined()
    expect(typeof data.notifications.unread).toBe('number')

    expect(data.sequences).toBeDefined()
    expect(typeof data.sequences.active).toBe('number')

    expect(data.aiCalls).toBeDefined()
    expect(typeof data.aiCalls.pending).toBe('number')

    expect(data.generatedAt).toBeTruthy()
  })
})
