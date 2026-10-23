import { getPayload } from 'payload'
import config from '@payload-config'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

/* eslint-disable @typescript-eslint/no-explicit-any */
type PostDoc = {
  id: string | number
  title: string
  slug: string
  description?: string
  featuredImage?: any
  author?: number | { id?: number | string; name?: string | null }
  tags?: { tag: string; id?: string | number }[]
  publishedAt?: string
  createdAt?: string
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs: latestDocs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1,
    sort: ['-publishedAt', '-createdAt'],
    depth: 1,
    overrideAccess: true,
  })

  const latestPost = latestDocs[0] as PostDoc | undefined
  const latestId = latestPost ? [latestPost.id] : []
  const { docs: queuedDocs } =
    latestPost
      ? await payload.find({
          collection: 'posts',
          where: {
            and: [
              { _status: { equals: 'published' } },
              { homepageQueuePosition: { greater_than: 0 } },
              { id: { not_in: latestId } },
            ],
          },
          limit: 5,
          sort: 'homepageQueuePosition',
          depth: 1,
          overrideAccess: true,
        })
      : { docs: [] }

  const queuedPosts = queuedDocs as PostDoc[]
  const remaining = 5 - queuedPosts.length
  const { docs: recentDocs } =
    remaining > 0 && latestPost
      ? await payload.find({
          collection: 'posts',
          where: {
            and: [
              { _status: { equals: 'published' } },
              {
                id: {
                  not_in: [
                    ...latestId,
                    ...queuedPosts.map((post) => post.id),
                  ],
                },
              },
            ],
          },
          limit: remaining,
          sort: ['-publishedAt', '-createdAt'],
          depth: 1,
          overrideAccess: true,
        })
      : { docs: [] }

  const posts = [
    ...(latestPost ? [latestPost] : []),
    ...queuedPosts,
    ...(recentDocs as PostDoc[]),
  ]
  const latest = posts[0]
  const rest = posts.slice(1)
  const latestDate = latest?.publishedAt ?? latest?.createdAt
  const latestAuthorName = typeof latest?.author === 'object' && latest.author?.name

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <main className={styles.primary}>
          {latest ? (
            <>
              <header className={styles.hero}>
                {(latestDate || latestAuthorName) && (
                  <div className={styles.heroMeta}>
                    {latestDate && (
                      <p className={styles.eyebrow}>
                        <time dateTime={latestDate}>
                          {new Date(latestDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </p>
                    )}
                    {latestAuthorName && (
                      <span className={styles.heroAuthor}>By {latestAuthorName}</span>
                    )}
                  </div>
                )}
                <h1 className={styles.heroTitle}>{latest.title}</h1>
              </header>

              {latest.featuredImage && typeof latest.featuredImage === 'object' && 'url' in latest.featuredImage && latest.featuredImage.url && (
                <div className={styles.heroImage}>
                  <img src={latest.featuredImage.url} alt={latest.title} />
                </div>
              )}

              {latest.description && (
                <p className={styles.heroSubtitle}>{latest.description}</p>
              )}

              <a href={`/posts/${latest.slug}`} className={styles.readMore}>
                Read more &rarr;
              </a>
            </>
          ) : (
            <header className={styles.hero}>
              <h1 className={styles.heroTitle}>Stories, art, and sound.</h1>
              <p className={styles.heroSubtitle}>A personal creative publication. Content is on the way.</p>
            </header>
          )}
        </main>

        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarHeading}>Recent</h2>
          {rest.length > 0 ? (
            <>
              {rest.map((post) => {
                const authorName = typeof post.author === 'object' && post.author?.name

                return (
                  <a key={post.id} href={`/posts/${post.slug}`} className={styles.recentItem}>
                    {(post.publishedAt || authorName) && (
                      <div className={styles.recentMeta}>
                        {post.publishedAt && (
                          <time className={styles.recentDate} dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                        )}
                        {authorName && (
                          <span className={styles.recentAuthor}>By {authorName}</span>
                        )}
                      </div>
                    )}
                    <span className={styles.recentTitle}>{post.title}</span>
                    {post.description && (
                      <span className={styles.recentDesc}>{post.description}</span>
                    )}
                  </a>
                )
              })}
              <a href="/posts" className={styles.viewAll}>
                View all work &rarr;
              </a>
            </>
          ) : (
            <p className={styles.emptyMsg}>Nothing here yet.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
