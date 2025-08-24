// src/pages/Profile.tsx
import { Box, useDisclosure } from '@chakra-ui/react'
import { useProfile } from '@features/profile/hooks/useProfile'
import ProfileDetails from '@features/profile/ui/ProfileDetails'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import { useAuth } from '@context/AuthContext'
import EditProfileModal from '@features/profile/ui/EditProfileModal'
import FollowersModal from '@features/follow/ui/FollowersModal'

const Profile = () => {
  const { profileUser, posts, loading, loadingPosts } = useProfile()
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const followersDisc = useDisclosure()
  const followingDisc = useDisclosure()

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
        loadingPosts={loadingPosts}
        onOpenFollowers={followersDisc.onOpen}
        onOpenFollowing={followingDisc.onOpen}
      />
      {isOwnProfile && <EditProfileModal isOpen={isOpen} onClose={onClose} user={profileUser} />}
      <FollowersModal
        uid={profileUser.uid}
        type="followers"
        isOpen={followersDisc.isOpen}
        onClose={followersDisc.onClose}
      />
      <FollowersModal
        uid={profileUser.uid}
        type="following"
        isOpen={followingDisc.isOpen}
        onClose={followingDisc.onClose}
      />
    </Box>
  )
}

export default Profile
