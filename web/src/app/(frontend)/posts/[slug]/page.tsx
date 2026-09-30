import { notFound } from 'next/navigation'
import { getPublishedPosts, getPostBySlug } from '../../../../lib/content'
import { RichText } from '../../components/RichText'
import styles from './page.module.css'

export const dynamicParams = false

/* eslint-disable @typescript-eslint/no-explicit-any */
type PostDoc = {
  id: string | number
  title: string
  slug: string
  description?: string
  content: any
  featuredImage?: any
  tags?: { tag: string; id?: string | number }[]
  publishedAt?: string
}

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPublishedPosts({ limit: 500, depth: 0 })
  return posts
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = (await getPostBySlug(slug)) as PostDoc | null
  if (!post) notFound()

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <article className={styles.page}>
      <a href="/posts" className={styles.backLink}>
        <svg className={styles.backChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All Posts
      </a>

      <header className={styles.hero}>
        {date && (
          <div className={styles.meta}>
            <time dateTime={post.publishedAt!}>{date}</time>
          </div>
        )}
        <h1 className={styles.title}>{post.title}</h1>
        {post.description && <p className={styles.lead}>{post.description}</p>}
      </header>

      {post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage && post.featuredImage.url && (
        <div className={styles.heroImage}>
          <img src={post.featuredImage.url} alt={post.title} />
        </div>
      )}

      <div className={styles.body}>
        <RichText content={post.content} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((t) => (
            <a key={t.tag} href={`/posts?tag=${encodeURIComponent(t.tag)}`} className={styles.tag}>{t.tag}</a>
          ))}
        </div>
      )}
    </article>
  )
}