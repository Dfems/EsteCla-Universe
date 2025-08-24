import React from 'react'
import { Box, Avatar, Flex, Grid, Text, Button, Tooltip, Link as CLink } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { UserInfo } from '@models/interfaces'
import { useFollow } from '@features/follow/hooks/useFollow'
import { useFollowCounts } from '@features/follow/hooks/useFollowCounts'

interface ProfileHeaderProps {
  profileUser: UserInfo
  postsCount: number
  isOwnProfile?: boolean
  onEdit?: () => void
  borderColor: string
  onOpenFollowers?: () => void
  onOpenFollowing?: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileUser,
  postsCount,
  isOwnProfile,
  onEdit,
  borderColor,
  onOpenFollowers,
  onOpenFollowing,
}) => {
  const { followers, following } = useFollowCounts(profileUser.uid)
  return (
    <Grid
      templateColumns={{ base: '80px 1fr', md: 'min-content 1fr' }}
      gap={{ base: 8, md: 10 }}
      alignItems="center"
      mb={{ base: 6, md: 10 }}
    >
      <Avatar
        src={profileUser.profilePic}
        size={{ base: 'xl', md: '2xl' }}
        name={profileUser.username}
        showBorder
        borderWidth="1px"
        borderColor={borderColor}
        alignSelf="center"
      />
      <Box w="full">
        <Flex align={{ base: 'flex-start', md: 'center' }} gap={4} mb={4} wrap="wrap">
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="semibold" noOfLines={1}>
            {profileUser.username}
          </Text>
          {isOwnProfile ? (
            <Tooltip label="Modifica profilo" hasArrow>
              <Button size="sm" variant="outline" onClick={onEdit} leftIcon={<EditIcon />}>
                Modifica profilo
              </Button>
            </Tooltip>
          ) : (
            <FollowSection targetUid={profileUser.uid} />
          )}
        </Flex>
        <Flex gap={{ base: 6, md: 8 }} mb={4}>
          <Text>
            <strong>{postsCount}</strong> post
          </Text>
          <CLink onClick={onOpenFollowers} cursor="pointer">
            <strong>{followers ?? profileUser.followers?.length ?? 0}</strong> follower
          </CLink>
          <CLink onClick={onOpenFollowing} cursor="pointer">
            <strong>{following ?? profileUser.following?.length ?? 0}</strong> seguiti
          </CLink>
        </Flex>
        {profileUser.fullName && (
          <Text fontWeight="semibold" mb={1}>
            {profileUser.fullName}
          </Text>
        )}
        {profileUser.bio && <Text whiteSpace="pre-wrap">{profileUser.bio}</Text>}
        {profileUser.birthday && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            🎂{' '}
            {new Date(profileUser.birthday).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        )}
      </Box>
    </Grid>
  )
}

export default ProfileHeader

const FollowSection: React.FC<{ targetUid: string }> = ({ targetUid }) => {
  const { isFollowing, follow, unfollow, loading } = useFollow(targetUid)
  return isFollowing ? (
    <Button size="sm" variant="outline" onClick={unfollow} isLoading={loading}>
      Smetti di seguire
    </Button>
  ) : (
    <Button size="sm" colorScheme="blue" onClick={follow} isLoading={loading}>
      Segui
    </Button>
  )
}
