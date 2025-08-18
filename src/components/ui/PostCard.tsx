import { Box, Image } from '@chakra-ui/react'

interface PostCardProps {
  post: {
    id: string
    imageUrl: string
    caption: string
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Box position="relative" cursor="pointer">
      <Image src={post.imageUrl} alt={post.caption} objectFit="cover" w="100%" h="100%" />
    </Box>
  )
}
