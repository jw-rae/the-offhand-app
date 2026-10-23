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
        readOnly: true,
        description: 'Set automatically when the post is first published.',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'homepageQueuePosition',
      type: 'number',
      unique: true,
      min: 1,
      access: {
        update: ({ req }) => isAdmin(req.user),
      },
      admin: {
        condition: (_, __, { user }) => isAdmin(user),
        description: 'Optional homepage queue order. Lowest number becomes the headline; leave blank to use publish date.',
        position: 'sidebar',
        step: 1,
      },
      validate: (value: number | null | undefined) =>
        value === undefined || value === null || Number.isInteger(value)
          ? true
          : 'Enter a whole-number queue position.',
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

        const status = data?._status ?? originalDoc?._status
        if (status === 'published') {
          data.publishedAt =
            operation === 'create' || originalDoc?._status !== 'published'
              ? new Date().toISOString()
              : originalDoc?.publishedAt ?? originalDoc?.createdAt ?? new Date().toISOString()
        } else {
          data.publishedAt = null
        }
        return data
      },
    ],
  },
}
