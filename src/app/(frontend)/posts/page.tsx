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
        <p className={styles.eyebrow}>Work</p>
        <h1 className={styles.title}>All Posts</h1>
      </div>

      {posts.length > 0 ? (
        <div className={styles.grid}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              description={post.description}
              publishedAt={post.publishedAt}
              tags={post.tags}
              featuredImageUrl={
                post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage
                  ? post.featuredImage.url
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No posts yet. Check back soon.</p>
      )}
    </div>
  )
}
