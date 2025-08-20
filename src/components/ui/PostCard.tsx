import { Box, Image, Flex, Text } from '@chakra-ui/react'

interface PostCardProps {
  post: {
    id: string
    imageUrl: string
    caption: string
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Box position="relative" cursor="pointer" role="group">
      {/* Wrapper quadrato stile Instagram */}
      <Box position="relative" w="100%" pt="100%" overflow="hidden">
        <Image
          src={post.imageUrl}
          alt={post.caption}
          objectFit="cover"
          w="100%"
          h="100%"
          position="absolute"
          top={0}
          left={0}
        />
        {/* Overlay al hover */}
        <Flex
          position="absolute"
          inset={0}
          bg="blackAlpha.500"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s ease"
          align="center"
          justify="center"
        >
          <Text fontSize="sm" color="white" px={2} noOfLines={1}>
            {post.caption}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}
