import React from 'react'
import { Grid } from '@chakra-ui/react'
import PostCard from '@components/ui/PostCard'
import { Post } from '@models/interfaces'

interface ProfilePostGridProps {
  posts: Post[]
  username?: string
}

const ProfilePostGrid: React.FC<ProfilePostGridProps> = ({ posts, username }) => (
  <Grid templateColumns="repeat(3, 1fr)" gap={1}>
    {posts.map((post) => (
      <PostCard key={post.id} post={post} username={username} />
    ))}
  </Grid>
)

export default ProfilePostGrid
