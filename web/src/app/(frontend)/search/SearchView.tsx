'use client'

import { useSearchParams } from 'next/navigation'
import { SearchToolbar } from './SearchToolbar'
import styles from './page.module.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type PostDoc = {
  id: string | number
  title: string
  slug: string
  description?: string
  featuredImage?: any
  tags?: { tag: string; id?: string | number }[]
  publishedAt?: string
}

type TagDoc = { tag: string }

interface SearchViewProps {
  posts: PostDoc[]
  tags: TagDoc[]
}

export function SearchView({ posts, tags }: SearchViewProps) {
  const searchParams = useSearchParams()

  const activeTag = searchParams.get('tag') || ''
  const query = searchParams.get('q') || ''
  const dateFrom = searchParams.get('from') || ''
  const dateTo = searchParams.get('to') || ''

  let filtered = posts

  if (activeTag) {
    filtered = filtered.filter((p) => p.tags?.some((t) => t.tag === activeTag))
  }

  if (dateFrom) {
    filtered = filtered.filter((p) => !p.publishedAt || p.publishedAt >= dateFrom)
  }

  if (dateTo) {
    const endOfDay = `${dateTo}T23:59:59.000Z`
    filtered = filtered.filter((p) => !p.publishedAt || p.publishedAt <= endOfDay)
  }

  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(
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
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
      </p>

      {filtered.length > 0 ? (
        <div className={styles.list}>
          {filtered.map((post) => {
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