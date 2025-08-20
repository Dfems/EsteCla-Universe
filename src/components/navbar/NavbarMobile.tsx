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
  />
)

export default NavbarMobile
