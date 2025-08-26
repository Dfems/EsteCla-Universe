import React from 'react'
import MobileBar from '@components/navbar/MobileBar'

interface NavbarMobileProps {
  bg: string
  borderColor: string
  uploading: boolean
  onHome: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  userProfilePic?: string | null
  notifications?: { count: number; onOpen: () => void }
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  bg,
  borderColor,
  uploading,
  onHome,
  onUpload,
  onRefresh,
  onProfile,
  userProfilePic,
  notifications,
}) => (
  <MobileBar
    bg={bg}
    borderColor={borderColor}
    uploading={uploading}
    onHome={onHome}
    onUpload={onUpload}
    onRefresh={onRefresh}
    onProfile={onProfile}
    userProfilePic={userProfilePic}
    notifications={notifications}
  />
)

export default NavbarMobile
