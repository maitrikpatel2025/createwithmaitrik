import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
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
import { SpecAds } from './collections/SpecAds'
import { Contacts } from './collections/Contacts'
import { Pipelines } from './collections/Pipelines'
import { Deals } from './collections/Deals'
import { Invoices } from './collections/Invoices'
import { Campaigns } from './collections/Campaigns'
import { TeamTasks } from './collections/TeamTasks'
import { ApiKeys } from './collections/ApiKeys'
import { Webhooks } from './collections/Webhooks'
import { ActivityLog } from './collections/ActivityLog'
import { Notifications } from './collections/Notifications'
import { Automations } from './collections/Automations'
import { Templates } from './collections/Templates'
import { Companies } from './collections/Companies'
import { CommunicationLog } from './collections/CommunicationLog'
import { AIAgents } from './collections/AIAgents'
import { AICallQueue } from './collections/AICallQueue'
import { Sequences } from './collections/Sequences'
import { Appointments } from './collections/Appointments'
import { Forms } from './collections/Forms'
import { Proposals } from './collections/Proposals'
import { Reviews } from './collections/Reviews'

import { SiteSettings } from './globals/SiteSettings'
import { LeadMagnet } from './globals/LeadMagnet'
import { PaidOffer } from './globals/PaidOffer'
import { MediaKitStats } from './globals/MediaKitStats'
import { LinkInBio } from './globals/LinkInBio'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useR2 = !!(process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_ENDPOINT)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Maitrik Patel CMS',
    },
  },
  collections: [Playbooks, Tools, Services, NewsletterIssues, Inquiries, SpecAds, Contacts, Companies, Pipelines, Deals, Invoices, Campaigns, TeamTasks, ApiKeys, Webhooks, ActivityLog, Notifications, Automations, Templates, CommunicationLog, AIAgents, AICallQueue, Sequences, Appointments, Forms, Proposals, Reviews, Media, Users],
  globals: [SiteSettings, LeadMagnet, PaidOffer, MediaKitStats, LinkInBio],
  plugins: [
    ...(useR2
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.R2_BUCKET!,
            config: {
              endpoint: process.env.R2_ENDPOINT!,
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
              },
              region: 'auto',
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
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
