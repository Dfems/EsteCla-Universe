import { Grid } from '@chakra-ui/react'
import type { Post } from '@estecla/types'
import { PostCard } from '../social'

export interface ProfilePostGridProps {
  posts: Post[]
  username?: string
  onOpenPost?: (postId: string) => void
}

export default function ProfilePostGrid({ posts, username, onOpenPost }: ProfilePostGridProps) {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={1}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          username={username}
          onOpen={onOpenPost?.bind(null, post.id)}
        />
      ))}
    </Grid>
  )
}
