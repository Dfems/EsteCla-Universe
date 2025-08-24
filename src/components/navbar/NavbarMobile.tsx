import React from 'react'
import MobileBar from '@components/navbar/MobileBar'
import BirthdayBadge from '@components/ui/BirthdayBadge'

interface NavbarMobileProps {
  bg: string
  borderColor: string
  uploading: boolean
  onHome: () => void
  onCountdown: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  secsToBirthday: number | null
  userProfilePic?: string | null
  notifications?: { count: number; onOpen: () => void }
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  bg,
  borderColor,
  uploading,
  onHome,
  onCountdown,
  onUpload,
  onRefresh,
  onProfile,
  secsToBirthday,
  userProfilePic,
  notifications,
}) => (
  <MobileBar
    bg={bg}
    borderColor={borderColor}
    uploading={uploading}
    onHome={onHome}
    onCountdown={onCountdown}
    onUpload={onUpload}
    onRefresh={onRefresh}
    onProfile={onProfile}
    userProfilePic={userProfilePic}
    renderBirthdayBadge={() => <BirthdayBadge secsToBirthday={secsToBirthday} />}
    notifications={notifications}
  />
)

export default NavbarMobile
