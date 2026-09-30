import { Suspense } from 'react'
import { getPublishedPosts } from '../../../lib/content'
import { SearchView, type PostDoc } from './SearchView'

export default async function SearchPage() {
  const posts = (await getPublishedPosts({ limit: 500, depth: 1 })) as PostDoc[]

  const tagSet = new Set<string>()
  for (const post of posts) {
    if (post.tags) {
      for (const t of post.tags) {
        tagSet.add(t.tag)
      }
    }
  }
  const tags = Array.from(tagSet).sort().map((tag) => ({ tag }))

  return (
    <Suspense fallback={null}>
      <SearchView posts={posts} tags={tags} />
    </Suspense>
  )
}