import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from './payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const PLAYBOOKS = [
  {
    title: 'The AI Ad Brief That Gets You Agency-Grade Output',
    slug: 'ai-ad-brief-agency-grade-output',
    summary: 'The exact brief structure I use to get cinematic AI ad output on the first generation — no redraws, no prompt roulette.',
    aiTool: 'Midjourney',
    topic: 'AI Ads',
    readTime: '8 min read',
    publishedDate: '2025-09-07',
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

\`\`\`
Character seed generation prompt:
[PERSON DESCRIPTION — age, features, expression, clothing]
Studio lighting, plain white background, sharp focus
--v 6 --seed [pick a number and write it down]
\`\`\`

Use \`--seed [your_number]\` on every subsequent prompt for that character.
`,
  },
  {
    title: 'How I Built OpenClaw: A Multi-Agent Research System',
    slug: 'openclaw-multi-agent-research-system',
    summary: 'The architecture behind a multi-agent setup that handles research, drafts content, and keeps my knowledge base fresh on a cron job.',
    aiTool: 'Claude',
    topic: 'AI Agents',
    readTime: '12 min read',
    publishedDate: '2025-10-14',
    featured: true,
    status: 'published',
    body: `## Why I built it

I was spending 3–4 hours a week on research and note-taking. Topics I needed to stay current on: AI model releases, prompt engineering research, ad creative trends, competitor content. Manual. Slow. Always behind.

The fix wasn't to read faster. It was to stop reading everything manually.

## The architecture

OpenClaw is three agents running in sequence, triggered by a cron job:

**Agent 1: Scout**
Pulls from RSS feeds, Hacker News API, arXiv, and a curated list of Twitter/X accounts via scraping. Filters by relevance score (keyword match + embedding similarity to topic clusters I defined). Outputs a JSON array of items with title, source, url, and relevance_score.

**Agent 2: Researcher**
Takes the Scout's output, fetches each URL, and produces a 150-word summary for each item. Uses Claude with a strict output format so parsing is deterministic. Flags items above a confidence threshold as "worth deep dive."

**Agent 3: Archivist**
Writes the summaries to Cortex (my Obsidian vault, via the Obsidian Local REST API plugin). Creates or updates notes, adds tags, links to related notes using a fuzzy match on note titles.

## The cron setup

Running on Railway. Two schedules:
- Every 6 hours: Scout + Researcher (quick sync)
- Every Sunday 8am: Researcher on flagged "deep dive" items + Archivist writes expanded notes

## The prompt that makes Agent 2 reliable

The biggest failure mode in multi-agent systems is output format drift. Agent 2 produces JSON that Agent 3 consumes. If Agent 2 gets creative with the format, Agent 3 breaks.

The fix: put the output format in the system prompt, not the user prompt. And include a worked example.

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

## What broke and how I fixed it

**The URL fetching problem**: Many URLs return paywalled or JS-rendered content. Scout now checks for paywall signals in the HTML before passing to Researcher. If detected, it pulls from Google Cache or skips.

**The Obsidian sync problem**: The Local REST API plugin requires Obsidian to be running. On Railway, that's not possible. Switched to direct file system writes to a Git repo that syncs to Obsidian on my machine via a GitHub Action.

**The noise problem**: First version surfaced too much. Added a relevance threshold (0.7 minimum on embedding similarity) and a source quality score based on historical signal-to-noise ratio. The system learns which sources are worth watching.

## What it's replaced

- 3–4 hours/week of manual research
- A Notion database I never kept updated
- Two newsletters I was subscribed to but never finished reading
`,
  },
  {
    title: 'The Hinglish Reel Formula That Hits Every Time',
    slug: 'hinglish-reel-formula',
    summary: '16 hooks, one rhythm, and the exact structure behind every reel I\'ve posted. This formula took 40 posts to lock in.',
    aiTool: 'Runway',
    topic: 'Built in Public',
    readTime: '6 min read',
    publishedDate: '2025-11-02',
    featured: true,
    status: 'published',
    body: `## The 40-post experiment

I posted 40 reels before I found the formula. Not 40 random ones — 40 structured tests. I varied one variable at a time: hook language (Hindi vs English vs Hinglish), hook type (question vs statement vs number), pacing, caption length, posting time.

The data was unambiguous. Hinglish hooks outperformed pure English by 2.3x on saves, and pure Hindi by 1.8x on shares. The dual-language audience is real and it rewards you for acknowledging both halves.

## The formula

Every reel I post follows this structure:

**0–2s: The hook**
One sentence. In Hinglish. Triggers either curiosity, FOMO, or a direct call-out. Never a question that can be answered with "no."

**2–8s: The proof**
Show don't tell. Screen recording, before/after, result first. No setup. The viewer already skeptical — earn the next 20 seconds.

**8–25s: The method**
3–5 steps. Numbered on screen. Voiceover in English, text in Hinglish. The dual-language pattern means the caption is searchable in both.

**25–30s: The CTA**
One ask. Not "like, comment, share, follow, save." One. I rotate between "save this" and "try it this week."

## The 16 hooks

These are the actual hooks I rotate through, grouped by type:

**Curiosity (best for tools/workflows):**
1. "Yeh tool koi nahi batata — and it's free"
2. "Maine 3 ghante ka kaam 8 minute mein kiya. Here's how."
3. "The AI feature everyone's sleeping on (Ab tak)"
4. "Yeh workflow mujhe 2 months pehle chahiye tha"

**FOMO (best for trends):**
5. "Jo log yeh nahi jaante, woh already behind hain"
6. "2025 mein yeh nahi seekha toh kab seekhoge"
7. "Sab yeh kar rahe hain and you're still doing it manually"
8. "Yeh trend 3 months mein mainstream hoga. Abhi sikh lo."

**Direct call-out (best for specific audiences):**
9. "Agar tum content creator ho, yeh dekho"
10. "Founders who want to ship AI ads — yeh formula use karo"
11. "Agar tum AI se ads banana chahte ho, yeh 5 steps hain"
12. "Marketing team ke bina agency-level creative. Here's the system."

**Number/result first (best for skeptics):**
13. "₹0 spend mein agency-grade ad. One weekend."
14. "5 tools. 1 ad. Dekho kaise."
15. "3 prompts. 1 cinematic shot. No redraws."
16. "47 AI tools tested. Yeh 6 actually work."

## The voiceover pattern

English voiceover + Hinglish text overlay. Why:
- English voiceover is more accessible for international audience
- Hinglish text is what gets saved and screenshotted
- The combination signals "this person understands both worlds"

Record voiceover at 1.15x your natural pace. It sounds normal on 1x playback.

## What doesn't work

Long hooks. If your first sentence is more than 12 words, cut it. The thumb is already moving.

Pure question hooks. "Have you ever wondered..." is dead. The algorithm has trained people to skip anything that starts with a question they can ignore.

Generic AI content. "Top 5 ChatGPT prompts" gets skipped because there are 10,000 of them. Specificity wins. "The prompt I use to write ad copy in 8 minutes for Indian brands" beats it every time.
`,
  },
  {
    title: 'Freepik + Nano Banana Pro: The Character-Consistent AI Ad Stack',
    slug: 'freepik-nano-banana-pro-character-consistent-stack',
    summary: 'The exact tool combination that solved character consistency across AI ad frames without redraws. Agency-grade output, one-person stack.',
    aiTool: 'Freepik',
    topic: 'AI Ads',
    readTime: '10 min read',
    publishedDate: '2025-12-07',
    featured: false,
    status: 'published',
    body: `## The character consistency problem

Every AI ad maker hits this wall: you generate a great frame with your talent in it, then you can't reproduce the same person in a different scene. Different lighting, different angle, slightly different face. The ad falls apart.

I tested 11 workflows before finding one that held across a full 30-second spot.

## The stack

**Freepik Flux** for base character generation
**Nano Banana Pro** for face-locked scene variations
**Runway Gen-3** for motion
**CapCut** for edit + voiceover

That's it. Four tools. Under $60/month combined.

## Step 1: Lock the character in Freepik

Freepik's Flux model with the portrait preset is the best starting point I've found for photorealistic characters. The key is the **reference image** feature — not the style reference, the character reference.

Generate 5–10 variants of your character in a neutral environment. Pick the one that has the clearest facial structure. This is your master reference.

Export at full resolution. This file is precious. Don't lose it.

## Step 2: Scene variation with Nano Banana Pro

Nano Banana Pro's "face lock" feature is what makes this workflow work. Upload your master reference, set the face lock strength to 0.85 (lower means more creative freedom, higher means tighter face lock — 0.85 is the sweet spot), and then prompt your scene.

The face holds. The lighting adapts to the new scene. The person looks like they're actually in the shot.

For a 30-second spot with 8 unique scenes, I generate 3 variations of each scene and pick the best one. That's 24 generations for 8 selects.

## Step 3: Motion in Runway

Take your selected stills into Runway Gen-3. Use the image-to-video endpoint, not text-to-video. The still is your anchor.

My standard motion settings:
- Duration: 4 seconds per clip
- Camera motion: subtle push-in or hold static depending on scene energy
- Motion strength: 2–3 (anything above 4 and faces start to drift)

For product shots, use "static" camera motion. For character shots, use "slow push-in." This combination makes the final edit feel intentional rather than randomly generated.

## Step 4: Edit in CapCut

CapCut over Premiere for AI ad work because:
1. The auto-captions are accurate enough for Hinglish
2. Beat-sync is one click
3. The color grading presets are actually usable without custom LUTs

My edit structure for a 30-second spot:
- 0–3s: hero shot (product or character), no caption
- 3–10s: product in use, captions on, music under voiceover
- 10–25s: b-roll montage, tighter cuts, music builds
- 25–30s: hold on logo/CTA, music out

## The cost breakdown

For a full spec ad (30 seconds, 8 scenes, 2 characters):
- Freepik: ~40 Flux generations = ~$8
- Nano Banana Pro: ~24 face-locked variations = ~$12
- Runway: ~30 clips at 4s = ~$18
- CapCut: free tier covers this volume

**Total: ~$38 per finished spec ad.**

An agency would charge $8,000–$25,000 for comparable live-action creative. The gap is the opportunity.
`,
  },
  {
    title: 'Building a Payload CMS Blog in a Weekend',
    slug: 'payload-cms-blog-weekend',
    summary: 'From zero to a fully self-hosted, admin-editable blog with Payload CMS v3 and Next.js 15. The exact steps, the exact gotchas.',
    aiTool: 'Claude',
    topic: 'AI Agents',
    readTime: '15 min read',
    publishedDate: '2026-01-11',
    featured: false,
    status: 'published',
    body: `## Why Payload over the alternatives

I've used Contentful, Sanity, and Strapi. For a solo operator who wants full control and no monthly CMS bill, Payload v3 is the answer.

It runs inside your Next.js app. No separate server. No API key management across environments. The admin panel is at /admin. The data is in SQLite (dev) or PostgreSQL (prod). The TypeScript types are auto-generated.

The tradeoff: more setup than a hosted CMS. Worth it for anything you're building to last.

## The project structure

\`\`\`
src/
  app/
    (frontend)/          # public pages
      page.tsx
      blog/
        page.tsx
        [slug]/page.tsx
    (payload)/           # admin
      admin/
        [[...segments]]/page.tsx
    api/
      [...slug]/route.ts # Payload REST API
  collections/
    Posts.ts
    Media.ts
    Users.ts
  payload.config.ts
  globals.css
\`\`\`

The route groups (parentheses in folder names) are Next.js App Router syntax. They let you have two different layouts — one for your frontend, one for the Payload admin — without affecting the URL structure.

## The collection definition

\`\`\`typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value || data?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        ],
      },
    },
    { name: 'summary', type: 'textarea' },
    { name: 'body', type: 'textarea', admin: { description: 'Markdown supported' } },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
  ],
}
\`\`\`

## The gotchas

**Gotcha 1: The import map**

Payload v3 requires an import map for the admin UI to work. In your payload.config.ts:

\`\`\`typescript
admin: {
  importMap: {
    baseDir: path.resolve(dirname),
  },
}
\`\`\`

Without this, the admin panel loads but custom components won't render.

**Gotcha 2: SQLite in production**

SQLite is great for dev. For production on Vercel or Railway, you need PostgreSQL. Install \`@payloadcms/db-postgres\` and swap the adapter. Your collection definitions don't change — only the adapter config.

**Gotcha 3: The local API vs REST API**

Payload has two ways to query data: the local API (direct function call, works in Server Components) and the REST API (HTTP, works anywhere). For Server Components, always use the local API — it's faster and skips the network round-trip.

\`\`\`typescript
// Local API (use in Server Components)
const payload = await getPayload({ config })
const posts = await payload.find({ collection: 'posts' })

// REST API (use in Client Components or external consumers)
const res = await fetch('/api/posts')
\`\`\`

**Gotcha 4: Sharp for image optimization**

Payload uses Sharp for image processing. Install it explicitly and import it in your config:

\`\`\`typescript
import sharp from 'sharp'
export default buildConfig({ sharp })
\`\`\`

On Vercel, add \`sharp\` to the \`serverExternalPackages\` in next.config.ts.

## The first admin user

On first run, Payload will redirect you to /admin/create-first-user. Set a strong password and save the credentials somewhere safe — there's no password reset flow unless you build one.

For local dev, I use a .env variable to seed the first user automatically:

\`\`\`
PAYLOAD_SEED_EMAIL=your@email.com
PAYLOAD_SEED_PASSWORD=dev-password-change-this
\`\`\`

Then in a seed script, create the user if none exists before starting the app.
`,
  },
  {
    title: 'The RPA Mindset That Makes AI Agents Actually Ship',
    slug: 'rpa-mindset-ai-agents-ship',
    summary: 'Five years of RPA taught me something that most AI agent builders skip: the workflow comes before the code. Here\'s how to apply it.',
    aiTool: 'Claude',
    topic: 'AI Agents',
    readTime: '9 min read',
    publishedDate: '2026-02-16',
    featured: false,
    status: 'published',
    body: `## What RPA got right that AI is forgetting

RPA (Robotic Process Automation) had a bad reputation — brittle bots, expensive maintenance, over-promised ROI. Some of that was deserved. But the discipline underneath it was sound.

Before any RPA bot shipped, you did a **process map**. Every step, every decision point, every exception, every handoff. Written down. Reviewed. Signed off. Then you built the bot.

AI agent builders skip this step. They start with the model, figure out the tools, and hope the prompt handles the edge cases. This is why most AI agents break in production.

## The process map for AI agents

Before I write a single line of code for an agent, I write a process map in plain language. It answers five questions:

1. **What triggers this?** (schedule, webhook, user action, another agent)
2. **What data does it need to start?** (inputs, context, credentials)
3. **What are the decision points?** (where does the flow branch?)
4. **What are the failure modes?** (what breaks and how do we recover?)
5. **What does "done" look like?** (output format, success criteria)

For OpenClaw's Scout agent:

**Triggers**: Cron job, every 6 hours
**Input data**: List of RSS feeds, HN API key, topic cluster embeddings
**Decision points**: Is relevance score above threshold? Is URL paywalled? Is this a duplicate of something from the last 48 hours?
**Failure modes**: RSS feed down (skip, log), API rate limit (exponential backoff), embedding service timeout (use keyword fallback)
**Done looks like**: JSON array of items, each with title, source, url, relevance_score, and paywalled flag

Only after this map was written did I start prompting Claude to help me build it.

## The exception handling gap

Most AI agent tutorials show the happy path. Input comes in, model processes it, output comes out. Clean.

Production agents live in the exception handling. The RSS feed is malformed XML. The API returns a 429. The model output doesn't match the expected format. The downstream service is down.

RPA discipline says: for every step in the process map, define what happens when it fails. Not "add a try/catch." Define the recovery behavior:

- Is this failure recoverable? (retry logic)
- Is this failure acceptable? (skip and log)
- Is this failure critical? (stop and alert)

Write these down before you build. Then implement them explicitly.

## The handoff protocol

In RPA, every handoff between systems has a defined format. Bot A produces a file with a specific schema. Bot B expects that schema. If A changes its output format, B breaks — and you know it immediately because the schema is documented.

In multi-agent AI systems, the equivalent is your intermediate data format. What does Agent 1 hand to Agent 2? Define it as a TypeScript type or a JSON schema. Validate on input. Fail loudly on mismatch.

\`\`\`typescript
// Define the handoff contract explicitly
type ScoutOutput = {
  id: string
  title: string
  source: string
  url: string
  relevance_score: number
  paywalled: boolean
  fetched_at: string
}

// Validate at the Researcher's entry point
function validateScoutOutput(data: unknown): data is ScoutOutput[] {
  // ...schema validation
}
\`\`\`

When Researcher receives Scout's output, it validates first. If validation fails, Researcher stops and logs the schema mismatch. This catches drift immediately instead of letting corrupt data propagate.

## The ROI question

The first question in any RPA project was always: what's the ROI? How many hours does this save? What's the error rate reduction? What's the cost to maintain?

AI agent projects skip this question. They get built because they're interesting, not because they're worth building.

Before starting any agent: estimate the hours saved per week, the cost to build, and the cost to maintain. If the payback period is more than 6 months, either the scope is too large or the problem isn't the right one to automate.

For OpenClaw: 3–4 hours/week saved. 2 weekends to build. Monthly infra cost under $20. Payback in under 3 weeks.

That's the bar.
`,
  },
]

const TOOLS = [
  { name: 'Midjourney', category: 'Image Generation', useCase: 'Photorealistic product and lifestyle shots', url: 'https://midjourney.com', tier: 'paid', featured: true, order: 1 },
  { name: 'Runway Gen-3', category: 'Video Generation', useCase: 'Image-to-video for ad spots', url: 'https://runwayml.com', tier: 'paid', featured: true, order: 2 },
  { name: 'Claude', category: 'AI Assistant', useCase: 'Copywriting, agent orchestration, code', url: 'https://claude.ai', tier: 'paid', featured: true, order: 3 },
  { name: 'Freepik Flux', category: 'Image Generation', useCase: 'Character-consistent portrait generation', url: 'https://freepik.com', tier: 'paid', featured: true, order: 4 },
  { name: 'CapCut', category: 'Video Editing', useCase: 'Reel edit, captions, beat-sync', url: 'https://capcut.com', tier: 'free', featured: true, order: 5 },
  { name: 'ElevenLabs', category: 'Voice', useCase: 'Voiceover generation for ad spots', url: 'https://elevenlabs.io', tier: 'paid', featured: false, order: 6 },
]

const SERVICES_DATA = [
  {
    order: 1,
    title: 'AI Ad Production',
    description: 'For founders and brands who want cinematic ad creative without an agency budget — concept, generation, edit, voiceover, finished asset.',
    deliverables: [
      { item: 'Concept + script' },
      { item: 'Image generation' },
      { item: 'Video generation' },
      { item: 'Edit + voiceover' },
    ],
    status: 'active',
  },
  {
    order: 2,
    title: 'AI Agent & Automation Builds',
    description: 'For businesses with repetitive ops. We map the workflow, pick the right model, and ship agents that actually run in production.',
    deliverables: [
      { item: 'Agent architecture' },
      { item: 'Multi-agent setup' },
      { item: 'Scheduled automations' },
      { item: 'Knowledge base' },
    ],
    status: 'active',
  },
  {
    order: 3,
    title: 'Built-in-Public Coaching',
    description: 'For creators who want the workflow. The reel formula, the gen stack, the systems — broken down on a 1:1.',
    deliverables: [
      { item: 'Reel formula' },
      { item: 'Gen stack' },
      { item: 'Systems teardown' },
      { item: '1:1 review' },
    ],
    status: 'active',
  },
]

async function seed() {
  const payload = await getPayload({ config })

  // --- Users ---
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: process.env.PAYLOAD_SEED_EMAIL || 'admin@maitrikpatel.io',
        password: process.env.PAYLOAD_SEED_PASSWORD || 'changeme123',
      },
    })
    console.log('✓ Created admin user')
  } else {
    console.log('· Admin user already exists')
  }

  // --- Site Settings ---
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: 'Create with Maitrik',
      tagline: 'Steal the Playbook.',
      statement: 'AI ads. AI agents. Built in public. One operator doing all three.',
      pillars: [
        { pillar: 'AI Ads' },
        { pillar: 'AI Agents' },
        { pillar: 'Built in Public' },
      ],
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
  console.log('✓ Updated site settings')

  // --- Lead Magnet ---
  await payload.updateGlobal({
    slug: 'lead-magnet',
    data: {
      headline: 'The Prompt Pack.',
      subheadline: '47 AI tools tested. These are the 12 prompts that actually ship ads.',
      cta: 'Get the pack — free',
      tag: 'lead-magnet',
    },
  })
  console.log('✓ Updated lead magnet')

  // --- Paid Offer ---
  await payload.updateGlobal({
    slug: 'paid-offer',
    data: {
      name: 'The AI Ad Playbook',
      tagline: 'My full spec-ad process, packaged. From brief to deliverable, every prompt, every tool, every edit decision.',
      status: 'waitlist',
      ctaText: 'Join the waitlist',
    },
  })
  console.log('✓ Updated paid offer')

  // --- Media Kit Stats ---
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
  console.log('✓ Updated media kit stats')

  // --- Tools ---
  const existingTools = await payload.find({ collection: 'tools', limit: 1 })
  if (existingTools.totalDocs === 0) {
    for (const tool of TOOLS) {
      await payload.create({ collection: 'tools', data: tool })
    }
    console.log(`✓ Seeded ${TOOLS.length} tools`)
  } else {
    console.log('· Tools already seeded')
  }

  // --- Services ---
  const existingServices = await payload.find({ collection: 'services', limit: 1 })
  if (existingServices.totalDocs === 0) {
    for (const svc of SERVICES_DATA) {
      await payload.create({ collection: 'services', data: svc })
    }
    console.log(`✓ Seeded ${SERVICES_DATA.length} services`)
  } else {
    console.log('· Services already seeded')
  }

  // --- Playbooks ---
  const existingPlaybooks = await payload.find({ collection: 'playbooks', limit: 1 })
  if (existingPlaybooks.totalDocs === 0) {
    for (const pb of PLAYBOOKS) {
      await payload.create({ collection: 'playbooks', data: pb })
    }
    console.log(`✓ Seeded ${PLAYBOOKS.length} playbooks`)
  } else {
    console.log('· Playbooks already seeded')
  }

  console.log('\n✅ Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
