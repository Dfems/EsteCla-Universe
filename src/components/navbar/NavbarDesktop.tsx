import React from 'react'
import DesktopBar from '@components/navbar/DesktopBar'

interface NavbarDesktopProps {
  bg: string
  borderColor: string
  textColor: string
  userProfilePic?: string
  uploading: boolean
  onHome: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  onLogout: () => void
  notifications?: { count: number; onOpen: () => void }
}

const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  bg,
  borderColor,
  textColor,
  userProfilePic,
  uploading,
  onHome,
  onUpload,
  onRefresh,
  onProfile,
  onLogout,
  notifications,
}) => (
  <DesktopBar
    bg={bg}
    borderColor={borderColor}
    textColor={textColor}
    userProfilePic={userProfilePic}
    uploading={uploading}
    onHome={onHome}
    onUpload={onUpload}
    onRefresh={onRefresh}
    onProfile={onProfile}
    onLogout={onLogout}
    notifications={notifications}
  />
)

export default NavbarDesktop
