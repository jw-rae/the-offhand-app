'use client'

import React from 'react'
import styles from './PostCard.module.css'

interface PostCardProps {
  title: string
  slug: string
  description?: string
  publishedAt?: string
  tags?: { tag: string }[]
  featuredImageUrl?: string
}

export function PostCard({ title, slug, description, publishedAt, tags, featuredImageUrl }: PostCardProps) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <a href={`/posts/${slug}`} className={styles.card}>
      {featuredImageUrl && (
        <div className={styles.thumb}>
          <img src={featuredImageUrl} alt={title} className={styles.thumbImg} />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.meta}>
          {date && <time className={styles.date}>{date}</time>}
          {tags?.map(({ tag }) => (
            <span key={tag} className={styles.badge}>{tag}</span>
          ))}
        </div>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </a>
  )
}
