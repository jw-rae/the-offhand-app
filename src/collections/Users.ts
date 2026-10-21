import type { CollectionConfig } from 'payload'
import { adminOnlyAccess, adminPanelAccess, isAdmin } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
    lockTime: 15 * 60 * 1000,
    maxLoginAttempts: 5,
    tokenExpiration: 60 * 60,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: adminPanelAccess,
    create: adminOnlyAccess,
    delete: adminOnlyAccess,
    read: adminOnlyAccess,
    update: adminOnlyAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
      admin: {
        condition: (_, __, { user }) => isAdmin(user),
        description: 'Admins manage all users and content. Editors manage all posts; authors manage their own posts. Only admins can delete posts or media.',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !req.user) {
          const { totalDocs } = await req.payload.find({
            collection: 'users',
            limit: 1,
            overrideAccess: true,
            req,
          })

          if (totalDocs === 0) data.role = 'admin'
        }

        return data
      },
    ],
  },
}
