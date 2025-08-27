import { Box } from '@chakra-ui/react'
import type { Post, UserInfo } from '@estecla/types'
import { PostListItem } from '../social'

export interface ProfilePostListProps {
  posts: Post[]
  user: Pick<UserInfo, 'username' | 'profilePic'>
  onOpenProfile?: (username: string) => void
  onOpenPost?: (postId: string) => void
}

export default function ProfilePostList({
  posts,
  user,
  onOpenProfile,
  onOpenPost,
}: ProfilePostListProps) {
  return (
    <Box px={1}>
      {posts.map((post) => (
        <PostListItem
          key={post.id}
          user={user}
          post={post}
          onOpenProfile={onOpenProfile?.bind(null, user.username)}
          onOpenPost={onOpenPost?.bind(null, post.id)}
        />
      ))}
    </Box>
  )
}
