'use client'

import React from 'react'
import styles from './RichText.module.css'

interface RichTextNode {
  type: string
  children?: RichTextNode[]
  text?: string
  format?: number
  style?: string
  tag?: string
  url?: string
  newTab?: boolean
  fields?: {
    url?: string
    linkType?: string
  }
  value?: {
    url?: string
    alt?: string
    width?: number
    height?: number
  }
}

function renderNode(node: RichTextNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    let text: React.ReactNode = node.text || ''

    if (node.format) {
      if (node.format & 1) text = <strong key={index}>{text}</strong>
      if (node.format & 2) text = <em key={index}>{text}</em>
      if (node.format & 8) text = <u key={index}>{text}</u>
      if (node.format & 16) text = <code key={index}>{text}</code>
      if (node.format & 32) text = <s key={index}>{text}</s>
    }

    return text
  }

  if (node.type === 'heading') {
    const headingTag = node.tag || 'h1'
    const HeadingTag = headingTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    return (
      <HeadingTag key={index} className={styles.heading}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </HeadingTag>
    )
  }

  if (node.type === 'paragraph') {
    return (
      <p key={index} className={styles.paragraph}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </p>
    )
  }

  if (node.type === 'list') {
    if (node.tag === 'ol') {
      return (
        <ol key={index} className={styles.list}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </ol>
      )
    }
    return (
      <ul key={index} className={styles.list}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </ul>
    )
  }

  if (node.type === 'listitem') {
    return (
      <li key={index}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </li>
    )
  }

  if (node.type === 'quote') {
    return (
      <blockquote key={index} className={styles.quote}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </blockquote>
    )
  }

  if (node.type === 'link') {
    const href = node.fields?.url || node.url || '#'
    return (
      <a key={index} href={href} className={styles.link} target={node.newTab ? '_blank' : undefined} rel={node.newTab ? 'noopener noreferrer' : undefined}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </a>
    )
  }

  if (node.type === 'upload' && node.value) {
    return (
      <figure key={index} className={styles.figure}>
        <img
          src={node.value.url}
          alt={node.value.alt || ''}
          width={node.value.width}
          height={node.value.height}
          className={styles.image}
        />
        {node.value.alt && (
          <figcaption className={styles.caption}>{node.value.alt}</figcaption>
        )}
      </figure>
    )
  }

  if (node.type === 'horizontalrule') {
    return <hr key={index} className={styles.hr} />
  }

  if (node.children) {
    return (
      <span key={index}>
        {node.children.map((child, i) => renderNode(child, i))}
      </span>
    )
  }

  return null
}

interface RichTextProps {
  content: {
    root: RichTextNode
  }
}

export function RichText({ content }: RichTextProps) {
  if (!content?.root) return null

  return (
    <div className={styles.root}>
      {content.root.children?.map((node, i) => renderNode(node, i))}
    </div>
  )
}
