'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './PostCard.module.css'

interface PostCardProps {
  title: string
  slug: string
  description?: string
  publishedAt?: string
  tags?: { tag: string }[]
  featuredImageUrl?: string
  variant?: 'short' | 'medium' | 'tall' | 'wide' | 'text-only'
}

const thumbClass = {
  short: styles.thumbMedium,
  medium: styles.thumbMedium,
  tall: styles.thumbTall,
  wide: styles.thumbWide,
  'text-only': styles.thumbNone,
}

export function PostCard({
  title, slug, description, publishedAt, tags, featuredImageUrl,
  variant = 'medium',
}: PostCardProps) {
  const router = useRouter()
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className={styles.card}>
      <a href={`/posts/${slug}`} className={styles.cardLink}>
        {featuredImageUrl && variant !== 'text-only' && (
          <div className={`${styles.thumb} ${thumbClass[variant] || styles.thumbMedium}`}>
            <img src={featuredImageUrl} alt={title} className={styles.thumbImg} />
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.meta}>
            {date && <time className={styles.date}>{date}</time>}
          </div>
          <h2 className={styles.title}>{title}</h2>
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </a>
      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(({ tag }) => (
            <span
              key={tag}
              className={styles.tag}
              role="link"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/posts?tag=${encodeURIComponent(tag)}`)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  router.push(`/posts?tag=${encodeURIComponent(tag)}`)
                }
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
