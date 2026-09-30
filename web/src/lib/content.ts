import { getPayload, type Payload } from 'payload'
import config from '../payload.config'

/* eslint-disable @typescript-eslint/no-explicit-any */

export type FeaturedImage = {
  id: number | string
  url?: string
  alt?: string
  width?: number
  height?: number
  [key: string]: any
}

export type PostDoc = {
  id: number | string
  title: string
  slug: string
  description?: string
  content?: any
  featuredImage?: FeaturedImage
  tags?: { tag: string; id?: number | string }[]
  publishedAt?: string
  [key: string]: any
}

export type SiteSettings = {
  title?: string
  logo?: FeaturedImage
  theme?: string
  fontFamily?: string
  [key: string]: any
}

let cached: Payload | null = null

function logMissingDb(scope: string) {
  console.warn(
    `[web] ${scope}: DATABASE_URL is not set. Build will render without dynamic content.`,
  )
}

async function getClient(): Promise<Payload | null> {
  if (!process.env.DATABASE_URL) {
    logMissingDb('payload client')
    return null
  }
  if (!cached) {
    try {
      cached = await getPayload({ config })
    } catch (err) {
      console.warn('[web] Failed to initialise payload client:', err)
      return null
    }
  }
  return cached
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const payload = await getClient()
  if (!payload) return null
  try {
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
  } catch (err) {
    console.warn('[web] Failed to fetch site settings:', err)
    return null
  }
}

export async function getPublishedPosts(opts: { limit?: number; depth?: number } = {}): Promise<PostDoc[]> {
  const { limit = 500, depth = 1 } = opts
  const payload = await getClient()
  if (!payload) return []
  try {
    const { docs } = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit,
      sort: '-publishedAt',
      depth,
    })
    return docs as PostDoc[]
  } catch (err) {
    console.warn('[web] Failed to fetch posts:', err)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<PostDoc | null> {
  const payload = await getClient()
  if (!payload) return null
  try {
    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 2,
    })
    return (docs[0] as PostDoc | undefined) || null
  } catch (err) {
    console.warn(`[web] Failed to fetch post "${slug}":`, err)
    return null
  }
}