// src/pages/Profile.tsx
import { Box, useDisclosure } from '@chakra-ui/react'
import { updateUserProfile } from '@estecla/firebase'
import { useAuth } from '@estecla/firebase-react'
import { EditProfileModal, ProfileDetails } from '@estecla/ui/profile'
import FollowersModal from '@features/follow/ui/FollowersModal'
import { useProfile } from '@features/profile/hooks/useProfile'

const Profile = () => {
  const { profileUser, posts, loading, loadingPosts } = useProfile()
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const followersDisc = useDisclosure()
  const followingDisc = useDisclosure()

  // Evita spinner infinito: mostra spinner solo durante il caricamento iniziale.
  // Se non c'è profilo e non stiamo più caricando, mostra un placeholder leggero.
  // if (loading) return <LoadingSpinner />
  if (loading)
    return (
      <>
        <div>{user?.email}</div>
      </>
    )
  if (!profileUser) return <Box p={6}>Profilo non trovato</Box>

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
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isOpen}
          onClose={onClose}
          user={profileUser}
          onSave={async (updates: {
            username: string
            fullName?: string
            bio?: string
            birthday?: string
            profilePicFile?: File | null
          }) => {
            await updateUserProfile({ current: profileUser, updates })
          }}
        />
      )}
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
