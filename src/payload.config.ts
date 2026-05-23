import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Playbooks } from './collections/Playbooks'
import { Tools } from './collections/Tools'
import { Services } from './collections/Services'
import { NewsletterIssues } from './collections/NewsletterIssues'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

import { SiteSettings } from './globals/SiteSettings'
import { LeadMagnet } from './globals/LeadMagnet'
import { PaidOffer } from './globals/PaidOffer'
import { MediaKitStats } from './globals/MediaKitStats'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Maitrik Patel CMS',
    },
    components: {
      graphics: {
        Logo: './components/admin/Logo',
        Icon: './components/admin/Icon',
      },
      Nav: './components/admin/Nav',
      beforeDashboard: ['./components/admin/DashboardBanner'],
    },
  },
  collections: [Playbooks, Tools, Services, NewsletterIssues, Inquiries, Media, Users],
  globals: [SiteSettings, LeadMagnet, PaidOffer, MediaKitStats],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || `file:${path.resolve(dirname, '../payload.db')}`,
    },
  }),
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'maitrikpatel-dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 50_000_000, // 50MB
    },
  },
})
