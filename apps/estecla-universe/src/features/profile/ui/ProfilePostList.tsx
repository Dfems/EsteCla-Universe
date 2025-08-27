import React from 'react'
import { Box } from '@chakra-ui/react'
import PostListItem from '@components/ui/PostListItem'
import { Post, UserInfo } from '@estecla/types'

interface ProfilePostListProps {
  posts: Post[]
  user: Pick<UserInfo, 'username' | 'profilePic'>
}

const ProfilePostList: React.FC<ProfilePostListProps> = ({ posts, user }) => (
  <Box px={1}>
    {posts.map((post) => (
      <PostListItem key={post.id} user={user} post={post} />
    ))}
  </Box>
)

export default ProfilePostList
