# Create with Maitrik — Site

Personal brand site for Maitrik Patel. Next.js 15 App Router + Payload CMS v3, SQLite for local dev.

## Quick start

```bash
npm install
cp .env.example .env.local   # edit if needed
npm run dev
```

Visit http://localhost:3000 — the site runs immediately with fallback data.

**Seed the database** (first run, one time):

```
http://localhost:3000/api/seed?token=seed-dev-2026
```

This creates the admin user, site settings, and all 6 starter playbooks. After seeding, log in at http://localhost:3000/admin.

Default admin credentials (change after first login):
- Email: `admin@maitrikpatel.io`
- Password: `changeme123`

## Routes

| URL | Description |
|-----|-------------|
| `/` | Home — hero, lead magnet, featured playbooks, tool stack |
| `/playbooks` | Playbook index with filter chips |
| `/playbooks/[slug]` | Full playbook with markdown renderer |
| `/services` | Services + inquiry form |
| `/partnerships` | Media kit |
| `/about` | Timeline + personal |
| `/newsletter` | Newsletter archive |
| `/admin` | Payload CMS admin panel |

## Content management

### Adding a playbook

1. Go to `/admin` → **Playbooks** → **Add New**
2. Fill **Title**, **Summary**, **Body** (paste Markdown from Claude)
3. Set **AI Tool** and **Topic**, add **Published Date**
4. Check **Featured** to show it on the home page (3 slots)
5. Set **Status** to `published` — save and it goes live

**Image markers**: In the body, write `[IMAGE-1]`, `[IMAGE-2]` etc. where images should appear. Then upload the images in the **Inline images** array and set each marker key to match.

### Changing socials / lead magnet / site name

Go to `/admin` → **Globals**:
- **Site Settings** — name, tagline, social links, email addresses
- **Lead Magnet** — the email capture headline + CTA copy
- **Paid Offer** — the "AI Ad Playbook" waitlist banner
- **Media Kit Stats** — the four proof numbers on the Partnerships page

### Adding newsletter issues

Go to `/admin` → **Newsletter Issues** → **Add New**. Fill title, summary, issue number, date, and external URL if the issue lives on Beehiiv/Substack.

## Email

Email capture is stubbed — subscribers are logged to the console. To wire a provider:

1. Set `EMAIL_PROVIDER=convertkit` (or `beehiiv`) in `.env.local`
2. Add the provider API key and form/list ID
3. Fill in the `// TODO` block in `src/lib/email.ts`

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PAYLOAD_SECRET` | JWT signing secret — **change in production** | dev secret |
| `DATABASE_URL` | SQLite file path or PostgreSQL URL | `file:./payload.db` |
| `EMAIL_PROVIDER` | `convertkit` or `beehiiv` (optional) | stub |
| `CONVERTKIT_API_KEY` | ConvertKit API key | — |
| `CONVERTKIT_FORM_ID` | ConvertKit form ID | — |
| `BEEHIIV_API_KEY` | Beehiiv API key | — |
| `BEEHIIV_PUBLICATION_ID` | Beehiiv publication ID | — |
| `SEED_TOKEN` | Token for the `/api/seed` route | `seed-dev-2026` |
| `PAYLOAD_SEED_EMAIL` | First admin email | `admin@maitrikpatel.io` |
| `PAYLOAD_SEED_PASSWORD` | First admin password | `changeme123` |

## Production deploy (Railway / Vercel)

**Database**: Switch from SQLite to PostgreSQL:
1. Install `@payloadcms/db-postgres`
2. In `payload.config.ts`, replace `sqliteAdapter` with `postgresAdapter`
3. Set `DATABASE_URL=postgresql://...` in your environment

**Payload secret**: Generate a strong random string for `PAYLOAD_SECRET`.

**Remove the seed route** (or protect it with a strong `SEED_TOKEN`) before going public.
