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
  tags?: { tag: string; id?: string | number }[]
  publishedAt?: string
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 6,
    sort: '-publishedAt',
    depth: 1,
  })

  const posts = docs as PostDoc[]
  const latest = posts[0]
  const rest = posts.slice(1)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <main className={styles.primary}>
          {latest ? (
            <>
              <header className={styles.hero}>
                {latest.publishedAt && (
                  <p className={styles.eyebrow}>
                    <time dateTime={latest.publishedAt}>
                      {new Date(latest.publishedAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </p>
                )}
                <h1 className={styles.heroTitle}>{latest.title}</h1>
                {latest.description && (
                  <p className={styles.heroSubtitle}>{latest.description}</p>
                )}
              </header>

              {latest.featuredImage && typeof latest.featuredImage === 'object' && 'url' in latest.featuredImage && latest.featuredImage.url && (
                <div className={styles.heroImage}>
                  <img src={latest.featuredImage.url} alt={latest.title} />
                </div>
              )}

              {latest.tags && latest.tags.length > 0 && (
                <div className={styles.tags}>
                  {latest.tags.map((t) => (
                    <span key={t.tag} className={styles.tag}>{t.tag}</span>
                  ))}
                </div>
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
          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarHeading}>Recent</h2>
            {rest.length > 0 ? (
              <ul className={styles.recentList}>
                {rest.map((post) => (
                  <li key={post.id}>
                    <a href={`/posts/${post.slug}`} className={styles.recentLink}>
                      <span className={styles.recentTitle}>{post.title}</span>
                      {post.publishedAt && (
                        <time className={styles.recentDate} dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyMsg}>Nothing here yet.</p>
            )}
          </div>

          {posts.length > 0 && (
            <a href="/posts" className={styles.viewAll}>
              View all work &rarr;
            </a>
          )}
        </aside>
      </div>
    </div>
  )
}
