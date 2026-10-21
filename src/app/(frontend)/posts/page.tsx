import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '../components/PostCard'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

/* eslint-disable @typescript-eslint/no-explicit-any */
type PostDoc = {
  id: string | number
  title: string
  slug: string
  description?: string
  featuredImage?: any
  author?: number | { name?: string | null }
  publishedAt?: string
}

const VARIANTS = ['short', 'medium', 'tall', 'wide', 'text-only'] as const

export default async function PostsPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 50,
    sort: '-publishedAt',
    depth: 1,
  })

  const posts = docs as PostDoc[]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>Work</p>
          <h1 className={styles.title}>All Posts</h1>
        </div>
        <a href="/search" className={styles.searchLink}>
          Advanced search &rarr;
        </a>
      </div>

      {posts.length > 0 ? (
        <div className={styles.masonry}>
          {posts.map((post, i) => {
            const hasImage = post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage && post.featuredImage.url
            const variant = hasImage ? VARIANTS[i % VARIANTS.length] : 'text-only'

            return (
              <PostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                description={post.description}
                publishedAt={post.publishedAt}
                authorName={typeof post.author === 'object' ? post.author?.name ?? undefined : undefined}
                featuredImageUrl={hasImage ? post.featuredImage.url : undefined}
                variant={variant}
              />
            )
          })}
        </div>
      ) : (
        <p className={styles.empty}>No posts found. Check back soon.</p>
      )}
    </div>
  )
}
