import { buildConfig, type Config } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from '../../src/collections/Users'
import { Posts } from '../../src/collections/Posts'
import { Media } from '../../src/collections/Media'
import { SiteSettings } from '../../src/globals/SiteSettings'

// Build-time-only Payload config used by the static frontend to fetch
// published content directly from the database during `next build`.
// It deliberately omits the admin panel, REST routes and the Azure storage
// plugin, and sets no `prodMigrations` so the production build never touches
// the database schema (see @payloadcms/db-postgres connect logic).
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'static-build-secret',
  collections: [Users, Posts, Media],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
} as Config)