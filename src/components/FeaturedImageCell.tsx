'use client'

import { useEffect, useState } from 'react'

type FeaturedImageCellProps = {
  cellData: unknown
  rowData: Record<string, unknown>
}

type MediaDocument = {
  id?: string | number
  thumbnailURL?: string | null
  url?: string | null
}

function getImageURL(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null

  if ('thumbnailURL' in value && typeof value.thumbnailURL === 'string') {
    return value.thumbnailURL
  }

  if ('url' in value && typeof value.url === 'string') {
    return value.url
  }

  return null
}

function getMediaID(value: unknown): string | number | null {
  if (typeof value === 'number' || (typeof value === 'string' && value.length > 0)) {
    return value
  }

  if (value && typeof value === 'object' && 'id' in value) {
    const { id } = value
    if (typeof id === 'number' || typeof id === 'string') return id
  }

  return null
}

export function FeaturedImageCell({ cellData, rowData }: FeaturedImageCellProps) {
  const relatedImage = rowData.featuredImage
  const [fetchedURL, setFetchedURL] = useState<string | null>(null)
  const src = getImageURL(relatedImage) || getImageURL(cellData) || fetchedURL
  const mediaID = getMediaID(relatedImage) ?? getMediaID(cellData)

  useEffect(() => {
    if (src || mediaID === null) return

    const controller = new AbortController()

    const loadMedia = async () => {
      try {
        const response = await fetch(`/api/media/${encodeURIComponent(String(mediaID))}?depth=0`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Loading featured image failed with status ${response.status}`)
        }

        const media = (await response.json()) as MediaDocument
        setFetchedURL(getImageURL(media))
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        console.error('Unable to load featured image for Posts list:', error)
      }
    }

    void loadMedia()

    return () => controller.abort()
  }, [mediaID, src])

  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 4 }}
    />
  )
}
