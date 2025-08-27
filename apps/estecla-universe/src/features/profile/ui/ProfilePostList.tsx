import React from 'react'
import { Box } from '@chakra-ui/react'
import { PostListItem } from '@estecla/ui/social'
import { Post, UserInfo } from '@estecla/types'
import { useNavigate } from 'react-router-dom'

interface ProfilePostListProps {
  posts: Post[]
  user: Pick<UserInfo, 'username' | 'profilePic'>
}

const ProfilePostList: React.FC<ProfilePostListProps> = ({ posts, user }) => {
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
