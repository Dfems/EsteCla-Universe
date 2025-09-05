import { Box, Image, Flex, Text } from '@chakra-ui/react'

export interface PostCardProps {
  post: {
    id: string
    imageUrl: string
    caption: string
  }
  username?: string
  onOpen?: () => void
}

export default function PostCard({ post, username, onOpen }: PostCardProps) {
  const handleClick = onOpen
  const clickable = Boolean(onOpen)
  return (
    <Box
      position="relative"
      cursor={clickable ? 'pointer' : 'default'}
      role="group"
      onClick={handleClick}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick?.()
              }
            }
          : undefined
      }
      aria-label={clickable ? `Apri profilo di ${username}` : undefined}
    >
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
