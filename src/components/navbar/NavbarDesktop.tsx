import React from 'react'
import DesktopBar from '@components/navbar/DesktopBar'
import BirthdayBadge from '@components/ui/BirthdayBadge'

interface NavbarDesktopProps {
  bg: string
  borderColor: string
  textColor: string
  colorMode: 'light' | 'dark'
  toggleColorMode: () => void
  userProfilePic?: string
  uploading: boolean
  onHome: () => void
  onCountdown: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  onLogout: () => void
  secsToBirthday: number | null
  notifications?: { count: number; onOpen: () => void }
}

const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  bg,
  borderColor,
  textColor,
  colorMode,
  toggleColorMode,
  userProfilePic,
  uploading,
  onHome,
  onCountdown,
  onUpload,
  onRefresh,
  onProfile,
  onLogout,
  secsToBirthday,
  notifications,
}) => (
  <DesktopBar
    bg={bg}
    borderColor={borderColor}
    textColor={textColor}
    colorMode={colorMode}
    toggleColorMode={toggleColorMode}
    userProfilePic={userProfilePic}
    uploading={uploading}
    onHome={onHome}
    onCountdown={onCountdown}
    onUpload={onUpload}
    onRefresh={onRefresh}
    onProfile={onProfile}
    onLogout={onLogout}
    renderBirthdayBadge={() => <BirthdayBadge secsToBirthday={secsToBirthday} />}
    notifications={notifications}
  />
)

export default NavbarDesktop
