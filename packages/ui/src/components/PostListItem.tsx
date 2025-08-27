import React from 'react'
import { Avatar, Box, Flex, HStack, Image, Text } from '@chakra-ui/react'
import type { UserInfo, Post } from '@estecla/types'

export interface PostListItemProps {
  user: Pick<UserInfo, 'username' | 'profilePic'>
  post: Post & { publishAt?: Date; imageUrl: string; caption: string }
  onOpenProfile?: () => void
  onOpenPost?: () => void
}

function formatDate(d?: Date) {
  if (!d) return ''
  try {
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

const PostListItem: React.FC<PostListItemProps> = ({ user, post, onOpenProfile, onOpenPost }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden" mb={4} bg="chakra-body-bg">
      <HStack spacing={3} px={3} py={2}>
        <Avatar
          size="sm"
          src={user.profilePic}
          name={user.username}
          cursor="pointer"
          onClick={onOpenProfile}
        />
        <Flex direction="column" minW={0} flex={1}>
          <Text fontWeight="semibold" noOfLines={1} cursor="pointer" onClick={onOpenProfile}>
            {user.username}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {formatDate(post.publishAt || post.createdAt || post.timestamp)}
          </Text>
        </Flex>
      </HStack>
      <Box cursor="pointer" onClick={onOpenPost ?? onOpenProfile}>
        <Image src={post.imageUrl} alt={post.caption} w="100%" objectFit="cover" />
      </Box>
      {post.caption ? (
        <Box px={3} py={2}>
          <Text whiteSpace="pre-wrap">{post.caption}</Text>
        </Box>
      ) : null}
    </Box>
  )
}

export default PostListItem
