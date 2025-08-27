import { Grid } from '@chakra-ui/react'
import { Post } from '@estecla/types'
import { PostCard } from '@estecla/ui/social'

interface ProfilePostGridProps {
  posts: Post[]
  username?: string
}
function ProfilePostGrid({ posts, username }: ProfilePostGridProps) {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={1}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} username={username} />
      ))}
    </Grid>
  )
}

export default ProfilePostGrid
