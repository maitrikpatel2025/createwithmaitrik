import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { validateApiKey, hasPermission } from '@/lib/apiKeyAuth'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Auth: check JWT session or API key
    const authHeader = req.headers.get('authorization')
    let authenticated = false

    if (authHeader?.startsWith('JWT ')) {
      // Payload session auth — verify via me endpoint
      try {
        const meResp = await fetch(`${req.nextUrl.origin}/api/users/me`, {
          headers: { Authorization: authHeader },
        })
        if (meResp.ok) {
          const meData = await meResp.json()
          authenticated = !!meData?.user
        }
      } catch { /* ignore */ }
    } else if (authHeader?.startsWith('Bearer ')) {
      const apiKey = await validateApiKey(authHeader)
      authenticated = !!(apiKey?.valid && hasPermission(apiKey.permissions, 'dashboard', 'read'))
    }

    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch stats in parallel
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      openDeals,
      overdueTasks,
      unpaidInvoices,
      newContacts,
      activeCampaigns,
      upcomingAppointments,
      unreadNotifications,
      activeSequences,
      pendingCalls,
    ] = await Promise.all([
      // Open deals (not Won or Lost)
      payload.find({
        collection: 'deals',
        where: {
          and: [
            { stage: { not_equals: 'Won' } },
            { stage: { not_equals: 'Lost' } },
          ],
        },
        limit: 0,
      }),

      // Overdue tasks (status not done/cancelled, dueDate in the past)
      payload.find({
        collection: 'team-tasks',
        where: {
          and: [
            { status: { not_in: ['done', 'cancelled'] } },
            { dueDate: { less_than: now.toISOString() } },
          ],
        },
        limit: 0,
      }),

      // Unpaid invoices (status: sent, viewed, overdue, partial)
      payload.find({
        collection: 'invoices',
        where: {
          status: { in: ['sent', 'viewed', 'overdue', 'partial'] },
        },
        limit: 1000,
      }),

      // New contacts this week
      payload.find({
        collection: 'contacts',
        where: {
          createdAt: { greater_than: weekAgo.toISOString() },
        },
        limit: 0,
      }),

      // Active campaigns
      payload.find({
        collection: 'campaigns',
        where: {
          status: { equals: 'active' },
        },
        limit: 1000,
      }),

      // Upcoming appointments (startTime in future, not cancelled)
      payload.find({
        collection: 'appointments',
        where: {
          and: [
            { startTime: { greater_than: now.toISOString() } },
            { status: { not_in: ['cancelled', 'completed', 'no-show'] } },
          ],
        },
        limit: 0,
      }),

      // Unread notifications
      payload.find({
        collection: 'notifications',
        where: {
          read: { equals: false },
        },
        limit: 0,
      }),

      // Active sequences
      payload.find({
        collection: 'sequences',
        where: {
          status: { equals: 'active' },
        },
        limit: 0,
      }),

      // Pending AI calls
      payload.find({
        collection: 'ai-call-queue',
        where: {
          status: { equals: 'pending' },
        },
        limit: 0,
      }),
    ])

    // Calculate aggregates
    const pipelineValue = (openDeals.docs as any[]).reduce(
      (sum, d) => sum + (d.value || 0),
      0,
    )

    const unpaidTotal = (unpaidInvoices.docs as any[]).reduce(
      (sum, i) => sum + (i.total || 0),
      0,
    )

    const totalAdSpend = (activeCampaigns.docs as any[]).reduce(
      (sum, c) => sum + (c.spend || 0),
      0,
    )

    return NextResponse.json({
      deals: {
        open: openDeals.totalDocs,
        pipelineValue,
      },
      tasks: {
        overdue: overdueTasks.totalDocs,
      },
      invoices: {
        unpaid: unpaidInvoices.totalDocs,
        unpaidTotal,
      },
      contacts: {
        newThisWeek: newContacts.totalDocs,
      },
      campaigns: {
        active: activeCampaigns.totalDocs,
        totalSpend: totalAdSpend,
      },
      appointments: {
        upcoming: upcomingAppointments.totalDocs,
      },
      notifications: {
        unread: unreadNotifications.totalDocs,
      },
      sequences: {
        active: activeSequences.totalDocs,
      },
      aiCalls: {
        pending: pendingCalls.totalDocs,
      },
      generatedAt: now.toISOString(),
    })
  } catch (err) {
    console.error('[dashboard]', err)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
