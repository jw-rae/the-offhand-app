'use client'

import { useSearchParams } from 'next/navigation'
import { PostCard } from '../components/PostCard'
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

const VARIANTS = ['short', 'medium', 'tall', 'wide', 'text-only'] as const

interface PostListProps {
  posts: PostDoc[]
}

export function PostList({ posts }: PostListProps) {
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag') || ''

  const filtered = activeTag
    ? posts.filter((post) => post.tags?.some((t) => t.tag === activeTag))
    : posts

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>Work</p>
          <h1 className={styles.title}>{activeTag || 'All Posts'}</h1>
        </div>
        <a href="/search" className={styles.searchLink}>
          Advanced search &rarr;
        </a>
      </div>

      {activeTag && (
        <div>
          <a href="/posts" className={styles.activeFilter}>
            {activeTag}
            <span className={styles.activeFilterX}>&times;</span>
          </a>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className={styles.masonry}>
          {filtered.map((post, i) => {
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