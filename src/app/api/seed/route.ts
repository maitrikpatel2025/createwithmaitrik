import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const PLAYBOOKS = [
  {
    title: 'The AI Ad Brief That Gets You Agency-Grade Output',
    slug: 'ai-ad-brief-agency-grade-output',
    summary: 'The exact brief structure I use to get cinematic AI ad output on the first generation — no redraws, no prompt roulette.',
    aiTool: 'Midjourney',
    topic: 'AI Ads',
    readTime: '8 min read',
    publishedDate: '2025-09-07T00:00:00.000Z',
    featured: true,
    status: 'published',
    body: `## The problem with most AI ad briefs

Most people prompt like they're texting a friend. "Make an ad for a coffee brand, luxury feeling, cinematic." The model does its best, you get something generic, and you iterate forever.

The brief is the bottleneck. Not the model.

## The three-layer brief structure

Every brief I write has three layers:

**Layer 1: Scene reality**
What exists in the frame. Not "luxury" — \`matte black espresso cup, steam rising, white marble counter, morning light at 7am\`. Real details the model can render.

**Layer 2: Camera language**
Focal length, shot type, motion. \`35mm lens, medium close-up, camera holds still while steam drifts\`. This tells the model how to *see*, not just what to show.

**Layer 3: Mood vector**
One reference point, not a mood board. \`Think Loro Piana catalogue, winter 2023\` is more useful than "elegant, warm, high-end."

## The prompt template

\`\`\`
[SCENE REALITY]
[PRODUCT]: [exact product description]
[SETTING]: [specific location, time of day, surface details]
[LIGHTING]: [light source, quality, direction]

[CAMERA LANGUAGE]
Shot on [CAMERA] with [LENS], [SHOT TYPE], [MOTION or STATIC]

[MOOD VECTOR]
In the style of [ONE SPECIFIC REFERENCE]

[TECHNICAL PARAMETERS]
--ar [ratio] --v 6 --style raw --stylize [value]
\`\`\`

## The coffee brand example

Here's the exact prompt that generated the LaneOne Coffee spec ad:

\`\`\`
Matte black ceramic espresso cup, single origin Ethiopian, steam curling upward, white Calacatta marble counter, kitchen window light, soft morning haze, golden hour warm

Shot on Leica Q2 with 28mm lens, medium close-up, camera static, steam in motion

In the style of Blue Bottle Coffee editorial, 2024

--ar 9:16 --v 6 --style raw --stylize 200
\`\`\`

Three generations. No redraws. Done.

## What to cut

If your brief contains any of these words, rewrite it: luxury, premium, elegant, modern, clean, minimal. These are outputs, not inputs. Describe the scene reality that *produces* those feelings instead.

## The character consistency trick

For multi-frame spots, generate your character in a neutral environment first (plain studio, white bg). Lock the seed. Then regenerate with your scene reality. The model holds the face across frames because it's anchored to the seed, not reinterpreting from your description.
`,
  },
  {
    title: 'How I Built OpenClaw: A Multi-Agent Research System',
    slug: 'openclaw-multi-agent-research-system',
    summary: 'The architecture behind a multi-agent setup that handles research, drafts content, and keeps my knowledge base fresh on a cron job.',
    aiTool: 'Claude',
    topic: 'AI Agents',
    readTime: '12 min read',
    publishedDate: '2025-10-14T00:00:00.000Z',
    featured: true,
    status: 'published',
    body: `## Why I built it

I was spending 3–4 hours a week on research and note-taking. The fix wasn't to read faster. It was to stop reading everything manually.

## The architecture

OpenClaw is three agents running in sequence, triggered by a cron job:

**Agent 1: Scout**
Pulls from RSS feeds, Hacker News API, arXiv, and a curated list of Twitter/X accounts via scraping. Filters by relevance score (keyword match + embedding similarity to topic clusters I defined).

**Agent 2: Researcher**
Takes the Scout's output, fetches each URL, and produces a 150-word summary for each item. Uses Claude with a strict output format so parsing is deterministic.

**Agent 3: Archivist**
Writes the summaries to Cortex (my Obsidian vault, via the Obsidian Local REST API plugin). Creates or updates notes, adds tags, links to related notes.

## The prompt that makes Agent 2 reliable

\`\`\`
System prompt for Researcher:
You are a research summarizer. For each item provided, output exactly this JSON structure:

{
  "id": "[item id from input]",
  "summary": "[150 words max, plain text, no markdown]",
  "key_points": ["point 1", "point 2", "point 3"],
  "tags": ["tag1", "tag2"],
  "deep_dive": true/false
}

Output a JSON array. No preamble. No explanation. Array only.
\`\`\`

## What it's replaced

- 3–4 hours/week of manual research
- A Notion database I never kept updated
- Two newsletters I was subscribed to but never finished reading
`,
  },
  {
    title: 'The Hinglish Reel Formula That Hits Every Time',
    slug: 'hinglish-reel-formula',
    summary: "16 hooks, one rhythm, and the exact structure behind every reel I've posted. This formula took 40 posts to lock in.",
    aiTool: 'Runway',
    topic: 'Built in Public',
    readTime: '6 min read',
    publishedDate: '2025-11-02T00:00:00.000Z',
    featured: true,
    status: 'published',
    body: `## The 40-post experiment

I posted 40 reels before I found the formula. The data was unambiguous. Hinglish hooks outperformed pure English by 2.3x on saves, and pure Hindi by 1.8x on shares.

## The formula

**0–2s: The hook**
One sentence. In Hinglish. Triggers either curiosity, FOMO, or a direct call-out.

**2–8s: The proof**
Show don't tell. Screen recording, before/after, result first. No setup.

**8–25s: The method**
3–5 steps. Numbered on screen. Voiceover in English, text in Hinglish.

**25–30s: The CTA**
One ask. Not "like, comment, share, follow, save." One. I rotate between "save this" and "try it this week."

## The 16 hooks

**Curiosity:**
1. "Yeh tool koi nahi batata — and it's free"
2. "Maine 3 ghante ka kaam 8 minute mein kiya. Here's how."
3. "The AI feature everyone's sleeping on (Ab tak)"
4. "Yeh workflow mujhe 2 months pehle chahiye tha"

**FOMO:**
5. "Jo log yeh nahi jaante, woh already behind hain"
6. "2025 mein yeh nahi seekha toh kab seekhoge"
7. "Sab yeh kar rahe hain and you're still doing it manually"
8. "Yeh trend 3 months mein mainstream hoga. Abhi sikh lo."

**Direct call-out:**
9. "Agar tum content creator ho, yeh dekho"
10. "Founders who want to ship AI ads — yeh formula use karo"
11. "Agar tum AI se ads banana chahte ho, yeh 5 steps hain"
12. "Marketing team ke bina agency-level creative. Here's the system."

**Number/result first:**
13. "₹0 spend mein agency-grade ad. One weekend."
14. "5 tools. 1 ad. Dekho kaise."
15. "3 prompts. 1 cinematic shot. No redraws."
16. "47 AI tools tested. Yeh 6 actually work."
`,
  },
  {
    title: 'Freepik + Nano Banana Pro: The Character-Consistent AI Ad Stack',
    slug: 'freepik-nano-banana-pro-character-consistent-stack',
    summary: 'The exact tool combination that solved character consistency across AI ad frames without redraws. Agency-grade output, one-person stack.',
    aiTool: 'Freepik',
    topic: 'AI Ads',
    readTime: '10 min read',
    publishedDate: '2025-12-07T00:00:00.000Z',
    featured: false,
    status: 'published',
    body: `## The character consistency problem

Every AI ad maker hits this wall: you generate a great frame with your talent in it, then you can't reproduce the same person in a different scene. I tested 11 workflows before finding one that held across a full 30-second spot.

## The stack

**Freepik Flux** for base character generation
**Nano Banana Pro** for face-locked scene variations
**Runway Gen-3** for motion
**CapCut** for edit + voiceover

Four tools. Under $60/month combined.

## Step 1: Lock the character in Freepik

Generate 5–10 variants of your character in a neutral environment. Pick the one that has the clearest facial structure. This is your master reference.

## Step 2: Scene variation with Nano Banana Pro

Upload your master reference, set the face lock strength to 0.85, and then prompt your scene. The face holds. The lighting adapts.

## The cost breakdown

For a full spec ad (30 seconds, 8 scenes, 2 characters):
- Freepik: ~40 Flux generations = ~$8
- Nano Banana Pro: ~24 face-locked variations = ~$12
- Runway: ~30 clips at 4s = ~$18
- CapCut: free tier covers this volume

**Total: ~$38 per finished spec ad.**
`,
  },
  {
    title: 'Building a Payload CMS Blog in a Weekend',
    slug: 'payload-cms-blog-weekend',
    summary: 'From zero to a fully self-hosted, admin-editable blog with Payload CMS v3 and Next.js 15. The exact steps, the exact gotchas.',
    aiTool: 'Claude',
    topic: 'AI Agents',
    readTime: '15 min read',
    publishedDate: '2026-01-11T00:00:00.000Z',
    featured: false,
    status: 'published',
    body: `## Why Payload over the alternatives

For a solo operator who wants full control and no monthly CMS bill, Payload v3 is the answer. It runs inside your Next.js app. No separate server. No API key management across environments.

## The project structure

\`\`\`
src/
  app/
    (frontend)/          # public pages
    (payload)/           # admin
    api/
      [...slug]/route.ts # Payload REST API
  collections/
    Posts.ts
    Media.ts
    Users.ts
  payload.config.ts
\`\`\`

## The gotchas

**Gotcha 1: The import map**
Payload v3 requires an import map for the admin UI to work. Without this, custom components won't render.

**Gotcha 2: SQLite in production**
SQLite is great for dev. For production on Vercel or Railway, you need PostgreSQL. Install \`@payloadcms/db-postgres\` and swap the adapter.

**Gotcha 3: The local API vs REST API**
For Server Components, always use the local API — it's faster and skips the network round-trip.

**Gotcha 4: Sharp for image optimization**
Payload uses Sharp for image processing. Install it explicitly and import it in your config.
`,
  },
  {
    title: 'The RPA Mindset That Makes AI Agents Actually Ship',
    slug: 'rpa-mindset-ai-agents-ship',
    summary: "Five years of RPA taught me something that most AI agent builders skip: the workflow comes before the code. Here's how to apply it.",
    aiTool: 'Claude',
    topic: 'AI Agents',
    readTime: '9 min read',
    publishedDate: '2026-02-16T00:00:00.000Z',
    featured: false,
    status: 'published',
    body: `## What RPA got right that AI is forgetting

Before any RPA bot shipped, you did a **process map**. Every step, every decision point, every exception, every handoff. Written down. Reviewed. Signed off. Then you built the bot.

AI agent builders skip this step. They start with the model, figure out the tools, and hope the prompt handles the edge cases. This is why most AI agents break in production.

## The process map for AI agents

Before I write a single line of code for an agent, I write a process map that answers five questions:

1. **What triggers this?**
2. **What data does it need to start?**
3. **What are the decision points?**
4. **What are the failure modes?**
5. **What does "done" look like?**

## The exception handling gap

Most AI agent tutorials show the happy path. Production agents live in the exception handling. For every step in the process map, define what happens when it fails:

- Is this failure recoverable? (retry logic)
- Is this failure acceptable? (skip and log)
- Is this failure critical? (stop and alert)

## The ROI question

Before starting any agent: estimate the hours saved per week, the cost to build, and the cost to maintain. If the payback period is more than 6 months, either the scope is too large or the problem isn't the right one to automate.

For OpenClaw: 3–4 hours/week saved. 2 weekends to build. Monthly infra cost under $20. Payback in under 3 weeks.
`,
  },
]

const TOOLS = [
  { name: 'Midjourney', oneLiner: 'Photorealistic product and lifestyle shots', tag: 'AI Ads', order: 1 },
  { name: 'Runway Gen-3', oneLiner: 'Image-to-video for ad spots', tag: 'AI Ads', order: 2 },
  { name: 'Claude', oneLiner: 'Copywriting, agent orchestration, code', tag: 'Agents', order: 3 },
  { name: 'Freepik Flux', oneLiner: 'Character-consistent portrait generation', tag: 'AI Ads', order: 4 },
  { name: 'CapCut', oneLiner: 'Reel edit, captions, beat-sync', tag: 'AI Ads', order: 5 },
  { name: 'ElevenLabs', oneLiner: 'Voiceover generation for ad spots', tag: 'Audio', order: 6 },
]

const SERVICES_DATA = [
  {
    order: 1, title: 'AI Ad Production',
    description: 'For founders and brands who want cinematic ad creative without an agency budget — concept, generation, edit, voiceover, finished asset.',
    deliverables: [{ item: 'Concept + script' }, { item: 'Image generation' }, { item: 'Video generation' }, { item: 'Edit + voiceover' }],
  },
  {
    order: 2, title: 'AI Agent & Automation Builds',
    description: 'For businesses with repetitive ops. We map the workflow, pick the right model, and ship agents that actually run in production.',
    deliverables: [{ item: 'Agent architecture' }, { item: 'Multi-agent setup' }, { item: 'Scheduled automations' }, { item: 'Knowledge base' }],
  },
  {
    order: 3, title: 'Built-in-Public Coaching',
    description: 'For creators who want the workflow. The reel formula, the gen stack, the systems — broken down on a 1:1.',
    deliverables: [{ item: 'Reel formula' }, { item: 'Gen stack' }, { item: 'Systems teardown' }, { item: '1:1 review' }],
  },
]

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const expectedToken = process.env.SEED_TOKEN || 'seed-dev-2026'
  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: string[] = []
  const payload = await getPayloadClient()

  try {
    // Site Settings
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        name: 'Create with Maitrik',
        tagline: 'Steal the Playbook.',
        statement: 'AI ads. AI agents. Built in public. One operator doing all three.',
        pillars: [{ label: 'AI Ads' }, { label: 'AI Agents' }, { label: 'Built in Public' }],
        location: 'Brampton, Ontario, Canada',
        year: String(new Date().getFullYear()),
        domain: 'maitrikpatel.io',
        helloEmail: 'hello@maitrikpatel.io',
        partnershipsEmail: 'partnerships@maitrikpatel.io',
        instagram: 'https://instagram.com/createwithmaitrik',
        youtube: '',
        tiktok: '',
        x: '',
        linkedin: 'https://linkedin.com/in/maitrikpatel',
      },
    })
    results.push('✓ Site settings')

    // Lead Magnet
    await payload.updateGlobal({
      slug: 'lead-magnet',
      data: {
        headline: 'The Prompt Pack.',
        subheadline: '47 AI tools tested. These are the 12 prompts that actually ship ads.',
        cta: 'Get the pack — free',
        tag: 'lead-magnet',
      },
    })
    results.push('✓ Lead magnet')

    // Paid Offer
    await payload.updateGlobal({
      slug: 'paid-offer',
      data: {
        name: 'The AI Ad Playbook',
        tagline: 'My full spec-ad process, packaged. From brief to deliverable, every prompt, every tool, every edit decision.',
        status: 'waitlist',
        ctaText: 'Join the waitlist',
      },
    })
    results.push('✓ Paid offer')

    // Media Kit Stats
    await payload.updateGlobal({
      slug: 'media-kit-stats',
      data: {
        stats: [
          { value: '$2.3M', label: 'Saved via RPA bots in industry' },
          { value: '47', label: 'AI tools personally tested' },
          { value: '6', label: 'Tools shipped + live' },
          { value: '4', label: 'Agents running on cron' },
        ],
      },
    })
    results.push('✓ Media kit stats')

    // Admin user
    const existingUsers = await payload.find({ collection: 'users', limit: 1 })
    if (existingUsers.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: process.env.PAYLOAD_SEED_EMAIL || 'admin@maitrikpatel.io',
          password: process.env.PAYLOAD_SEED_PASSWORD || 'changeme123',
        },
      })
      results.push('✓ Admin user created')
    } else {
      results.push('· Admin user already exists')
    }

    // Tools
    const existingTools = await payload.find({ collection: 'tools', limit: 1 })
    if (existingTools.totalDocs === 0) {
      for (const t of TOOLS) await payload.create({ collection: 'tools', data: t })
      results.push(`✓ ${TOOLS.length} tools`)
    } else {
      results.push('· Tools already seeded')
    }

    // Services
    const existingServices = await payload.find({ collection: 'services', limit: 1 })
    if (existingServices.totalDocs === 0) {
      for (const s of SERVICES_DATA) await payload.create({ collection: 'services', data: s })
      results.push(`✓ ${SERVICES_DATA.length} services`)
    } else {
      results.push('· Services already seeded')
    }

    // Playbooks
    const existingPlaybooks = await payload.find({ collection: 'playbooks', limit: 1 })
    if (existingPlaybooks.totalDocs === 0) {
      for (const pb of PLAYBOOKS) await payload.create({ collection: 'playbooks', data: pb })
      results.push(`✓ ${PLAYBOOKS.length} playbooks`)
    } else {
      results.push('· Playbooks already seeded')
    }

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    console.error('[seed]', err)
    return NextResponse.json({ error: String(err), results }, { status: 500 })
  }
}
