'use client'

import React from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  if (!videoId) return null

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title || 'YouTube video'}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
