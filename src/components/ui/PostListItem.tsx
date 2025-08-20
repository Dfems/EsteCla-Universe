import React from 'react'
import { Avatar, Box, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { UserInfo, Post } from '@models/interfaces'

interface PostListItemProps {
  user: Pick<UserInfo, 'username' | 'profilePic'>
  post: Post & { publishAt?: Date; imageUrl: string; caption: string }
}

function formatDate(d?: Date) {
  if (!d) return ''
  try {
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

const PostListItem: React.FC<PostListItemProps> = ({ user, post }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden" mb={4} bg="chakra-body-bg">
      {/* Header */}
      <HStack spacing={3} px={3} py={2}>
        <Avatar size="sm" src={user.profilePic} name={user.username} />
        <Flex direction="column" minW={0} flex={1}>
          <Text fontWeight="semibold" noOfLines={1}>
            {user.username}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {formatDate(post.publishAt || post.createdAt || post.timestamp)}
          </Text>
        </Flex>
      </HStack>
      {/* Immagine */}
      <Box>
        <Image src={post.imageUrl} alt={post.caption} w="100%" objectFit="cover" />
      </Box>
      {/* Descrizione */}
      {post.caption ? (
        <Box px={3} py={2}>
          <Text whiteSpace="pre-wrap">{post.caption}</Text>
        </Box>
      ) : null}
    </Box>
  )
}

export default PostListItem
