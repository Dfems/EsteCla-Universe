import React from 'react'
import { Avatar, Box, Button, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { useThemeColors } from '@estecla/hooks'
import type { UserInfo } from '@estecla/types'
import { useFollow } from '@features/follow/hooks/useFollow'
import { Link } from 'react-router-dom'

interface SuggestedUsersProps {
  users: UserInfo[]
  title?: string
  max?: number
}

const SuggestedUsers: React.FC<SuggestedUsersProps> = ({
  users,
  title = 'Suggeriti per te',
  max = 8,
}) => {
  const { containerBg, borderColor, textColor } = useThemeColors()

  const sliced = users?.slice(0, max) || []
  if (!sliced.length) return null
  return (
    <Box
      bg={containerBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={3}
      w="full"
    >
      <Heading as="h3" size="sm" mb={2} color={textColor}>
        {title}
      </Heading>
      <VStack spacing={2} align="stretch">
        {sliced.map((u) => (
          <UserRow key={u.uid} user={u} />
        ))}
      </VStack>
    </Box>
  )
}

const UserRow: React.FC<{ user: UserInfo }> = ({ user }) => {
  const { isFollowing, follow, loading } = useFollow(user.uid)
  if (isFollowing) return null
  return (
    <HStack justify="space-between">
      <HStack as={Link} to={`/profile/${user.username}`} gap={3} minW={0}>
        <Avatar size="sm" src={user.profilePic} name={user.username} />
        <Stack spacing={0} minW={0}>
          <Text fontWeight="semibold" noOfLines={1}>
            {user.username}
          </Text>
          {user.fullName && (
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              {user.fullName}
            </Text>
          )}
        </Stack>
      </HStack>
      <Button size="xs" onClick={follow} isLoading={loading} variant="solid" colorScheme="blue">
        Segui
      </Button>
    </HStack>
  )
}

export default SuggestedUsers
