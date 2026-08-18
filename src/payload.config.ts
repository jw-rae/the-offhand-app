import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, UploadFeature, BlocksFeature } from '@payloadcms/richtext-lexical'
import { azureStorage } from '@payloadcms/storage-azure'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'
import { YouTubeEmbed } from './blocks/YouTubeEmbed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Posts, Media],
  globals: [SiteSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
                admin: {
                  description: 'Optional caption for the image',
                },
              },
            ],
          },
        },
      }),
      BlocksFeature({
        blocks: [YouTubeEmbed],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    azureStorage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accountName: process.env.S3_ACCOUNT_NAME || '',
          accountKey: process.env.S3_ACCOUNT_KEY || '',
        },
      },
    }),
  ],
})
