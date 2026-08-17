import { getPayload } from 'payload'
import config from '@payload-config'
import { SearchToolbar } from './SearchToolbar'
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

interface SearchPageProps {
  searchParams: Promise<{ tag?: string; q?: string; from?: string; to?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const payload = await getPayload({ config })

  const where: any = { _status: { equals: 'published' } }

  if (params.tag) {
    where['tags.tag'] = { equals: params.tag }
  }

  if (params.from || params.to) {
    const publishedAt: any = {}
    if (params.from) publishedAt.greater_than_equal = params.from
    if (params.to) publishedAt.less_than_equal = params.to + 'T23:59:59.000Z'
    where.publishedAt = publishedAt
  }

  const { docs: allPosts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 500,
    sort: '-publishedAt',
    depth: 1,
  })

  const { docs: filteredPosts } = await payload.find({
    collection: 'posts',
    where,
    limit: 100,
    sort: '-publishedAt',
    depth: 1,
  })

  const allPostsTyped = allPosts as PostDoc[]

  const tagSet = new Set<string>()
  for (const post of allPostsTyped) {
    if (post.tags) {
      for (const t of post.tags) {
        tagSet.add(t.tag)
      }
    }
  }
  const tags = Array.from(tagSet).sort().map((tag) => ({ tag }))

  let posts = filteredPosts as PostDoc[]

  if (params.q) {
    const q = params.q.toLowerCase()
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.tag.toLowerCase().includes(q))),
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Search</p>
        <h1 className={styles.title}>Find Posts</h1>
      </div>

      <SearchToolbar tags={tags} />

      <p className={styles.resultCount}>
        {posts.length} {posts.length === 1 ? 'result' : 'results'}
      </p>

      {posts.length > 0 ? (
        <div className={styles.list}>
          {posts.map((post) => {
            const hasImage = post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage && post.featuredImage.url

            return (
              <a key={post.id} href={`/posts/${post.slug}`} className={styles.listItem}>
                <div className={styles.listContent}>
                  <div className={styles.listMeta}>
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                  </div>
                  <h2 className={styles.listTitle}>{post.title}</h2>
                  {post.description && (
                    <p className={styles.listDesc}>{post.description}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.listTags}>
                      {post.tags.map((t) => (
                        <span key={t.tag} className={styles.listTag}>{t.tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {hasImage && (
                  <div className={styles.listThumb}>
                    <img src={post.featuredImage.url} alt={post.title} />
                  </div>
                )}
              </a>
            )
          })}
        </div>
      ) : (
        <p className={styles.empty}>No posts found.</p>
      )}
    </div>
  )
}
