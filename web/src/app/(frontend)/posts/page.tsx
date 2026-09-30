import { Suspense } from 'react'
import { getPublishedPosts } from '../../../lib/content'
import { PostList, type PostDoc } from './PostList'

export default async function PostsPage() {
  const posts = (await getPublishedPosts({ limit: 500, depth: 1 })) as PostDoc[]

  return (
    <Suspense fallback={null}>
      <PostList posts={posts} />
    </Suspense>
  )
}