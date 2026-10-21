import type { CollectionConfig } from 'payload'
import { adminOnlyAccess, adminPanelAccess } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'text/markdown', 'text/plain', 'application/pdf'],
  },
  admin: {
    defaultColumns: ['filename', 'createdAt', 'updatedAt'],
    useAsTitle: 'filename',
  },
  access: {
    admin: adminPanelAccess,
    create: adminPanelAccess,
    delete: adminOnlyAccess,
    read: () => true,
    update: adminOnlyAccess,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
