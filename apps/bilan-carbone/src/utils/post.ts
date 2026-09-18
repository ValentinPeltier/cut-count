import { subPostsByPost } from '@/services/posts'
import { SubPost } from '@abc-transitionbascarbone/db-common/enums'
import { Post } from '@abc-transitionbascarbone/utils/charts'

export const flattenSubposts = (posts: Post[] | SubPost[] | Record<string, SubPost[] | boolean>): SubPost[] => {
  if (Array.isArray(posts)) {
    return posts.flatMap((post) => (post in subPostsByPost ? subPostsByPost[post as Post] : [post as SubPost]))
  }

  return Object.entries(posts).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value
    }
    if (value && key in subPostsByPost) {
      return subPostsByPost[key as Post]
    }
    return []
  })
}

export const withInfobulle = (_post: Post) => false
