// src/pages/Profile.tsx
import { Box, useDisclosure } from '@chakra-ui/react'
import { useProfile } from '@features/profile/hooks/useProfile'
import ProfileDetails from '@features/profile/ui/ProfileDetails'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import { useAuth } from '@context/AuthContext'
import EditProfileModal from '@features/profile/ui/EditProfileModal'

const Profile = () => {
  const { profileUser, posts, loading } = useProfile()
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (loading || !profileUser) {
    return <LoadingSpinner />
  }

  const isOwnProfile = user?.uid === profileUser.uid

  return (
    <Box>
      <ProfileDetails
        profileUser={profileUser}
        posts={posts}
        isOwnProfile={isOwnProfile}
        onEdit={onOpen}
      />
      {isOwnProfile && <EditProfileModal isOpen={isOpen} onClose={onClose} user={profileUser} />}
    </Box>
  )
}

export default Profile
