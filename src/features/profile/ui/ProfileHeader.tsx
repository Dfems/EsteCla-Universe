import React from 'react'
import { Box, Avatar, Flex, Grid, Text, Button, Tooltip } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { UserInfo } from '@models/interfaces'

interface ProfileHeaderProps {
  profileUser: UserInfo
  postsCount: number
  isOwnProfile?: boolean
  onEdit?: () => void
  borderColor: string
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileUser,
  postsCount,
  isOwnProfile,
  onEdit,
  borderColor,
}) => (
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
        {isOwnProfile && (
          <Tooltip label="Modifica profilo" hasArrow>
            <Button size="sm" variant="outline" onClick={onEdit} leftIcon={<EditIcon />}>
              Modifica profilo
            </Button>
          </Tooltip>
        )}
      </Flex>
      <Flex gap={{ base: 6, md: 8 }} mb={4}>
        <Text>
          <strong>{postsCount}</strong> post
        </Text>
        <Text>
          <strong>{profileUser.followers?.length ?? 0}</strong> follower
        </Text>
        <Text>
          <strong>{profileUser.following?.length ?? 0}</strong> seguiti
        </Text>
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

export default ProfileHeader
