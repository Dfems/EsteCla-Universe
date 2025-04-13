// src/pages/Profile.tsx
import { Box } from '@chakra-ui/react'
import { useProfile } from '../hooks/useProfile'
import ProfileDetails from '../components/Profile/ProfileDetails'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Profile = () => {
  const { profileUser, posts, loading } = useProfile()

  if (loading || !profileUser) {
    return <LoadingSpinner />
  }

  return (
    <Box>
      <ProfileDetails profileUser={profileUser} posts={posts} />
    </Box>
  )
}

export default Profile
