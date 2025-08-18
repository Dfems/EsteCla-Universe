// src/pages/Profile.tsx
import { Box, useDisclosure } from '@chakra-ui/react'
import { useProfile } from '../hooks/useProfile'
import ProfileDetails from '../components/Profile/ProfileDetails'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import EditProfileModal from '../components/Profile/EditProfileModal'

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
