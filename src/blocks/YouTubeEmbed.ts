import type { Block } from 'payload'

export const YouTubeEmbed: Block = {
  slug: 'youtube-embed',
  fields: [
    {
      name: 'videoId',
      type: 'text',
      required: true,
      admin: {
        description: 'YouTube video ID (e.g. dQw4w9WgXcQ) or full URL',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional title for accessibility',
      },
    },
  ],
}
