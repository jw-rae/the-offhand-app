import type { CollectionConfig } from 'payload'
import { adminOnlyAccess, postCreateAccess, postReadAccess, postUpdateAccess, isAdmin } from '../lib/access'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['featuredImage', 'title', 'slug', 'author', 'createdAt', 'updatedAt', '_status'],
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  access: {
    create: postCreateAccess,
    delete: adminOnlyAccess,
    read: postReadAccess,
    readVersions: postReadAccess,
    update: postUpdateAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData, operation }) => {
            if (operation === 'create' && !value && siblingData?.title) {
              return siblingData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        condition: (_, __, { user }) => isAdmin(user),
        description: 'Post owner. Only admins can change the owner.',
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 1,
      admin: {
        components: {
          Cell: '/components/FeaturedImageCell#FeaturedImageCell',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date Posted',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'telegramUpdateId',
      type: 'text',
      unique: true,
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc, req }) => {
        if (req.user && !isAdmin(req.user)) {
          const originalAuthor = originalDoc?.author
          data.author =
            operation === 'create'
              ? req.user.id
              : typeof originalAuthor === 'object' && originalAuthor !== null
                ? originalAuthor.id
                : originalAuthor
        }

        if (operation === 'create' && data?._status === 'published' && !data?.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
