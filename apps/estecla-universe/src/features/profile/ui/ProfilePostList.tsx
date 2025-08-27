import { Box } from '@chakra-ui/react'
import { Post, UserInfo } from '@estecla/types'
import { PostListItem } from '@estecla/ui/social'
import { useNavigate } from 'react-router-dom'

interface ProfilePostListProps {
  posts: Post[]
  user: Pick<UserInfo, 'username' | 'profilePic'>
}

function ProfilePostList({ posts, user }: ProfilePostListProps) {
  const navigate = useNavigate()
  return (
    <Box px={1}>
      {posts.map((post) => (
        <PostListItem
          key={post.id}
          user={user}
          post={post}
          onOpenProfile={() => navigate(`/profile/${user.username}`)}
          onOpenPost={() => navigate(`/post/${post.id}`)}
        />
      ))}
    </Box>
  )
}

export default ProfilePostList
