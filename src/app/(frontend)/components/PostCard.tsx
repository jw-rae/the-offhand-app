'use client'

import React from 'react'
import styles from './PostCard.module.css'

interface PostCardProps {
  title: string
  slug: string
  description?: string
  publishedAt?: string
  authorName?: string
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
  title, slug, description, publishedAt, authorName, featuredImageUrl,
  variant = 'medium',
}: PostCardProps) {
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
            {authorName && <span className={styles.author}>By {authorName}</span>}
          </div>
          <h2 className={styles.title}>{title}</h2>
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </a>
    </div>
  )
}
