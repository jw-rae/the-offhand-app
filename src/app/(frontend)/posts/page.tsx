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
  tags?: { tag: string; id?: string | number }[]
  publishedAt?: string
}

const VARIANTS = ['short', 'medium', 'tall', 'wide', 'text-only'] as const

interface PostsPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const payload = await getPayload({ config })

  const where: any = { _status: { equals: 'published' } }

  if (params.tag) {
    where['tags.tag'] = { equals: params.tag }
  }

  const { docs } = await payload.find({
    collection: 'posts',
    where,
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
          <h1 className={styles.title}>
            {params.tag ? params.tag : 'All Posts'}
          </h1>
        </div>
        <a href="/search" className={styles.searchLink}>
          Advanced search &rarr;
        </a>
      </div>

      {params.tag && (
        <div>
          <a href="/posts" className={styles.activeFilter}>
            {params.tag}
            <span className={styles.activeFilterX}>&times;</span>
          </a>
        </div>
      )}

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
                tags={post.tags}
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
