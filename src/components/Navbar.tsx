import React from 'react'
import { useColorMode, VisuallyHidden, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import useThemeColors from '@hooks/useThemeColors'
import { useBirthdayCountdown } from '@/features/birthday/hooks/useBirthdayCountdown'

import NavbarDesktop from '@components/navbar/NavbarDesktop'
import NavbarMobile from '@components/navbar/NavbarMobile'
import UploadModal from '@components/navbar/UploadModal'
import { useNavbarUpload } from '@hooks/useNavbarUpload'
import useUnreadNotifications from '@features/notifications/hooks/useUnreadNotifications'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const { containerBg, borderColor, textColor } = useThemeColors()
  const secsToBirthday = useBirthdayCountdown(user?.birthday)
  const bg = containerBg
  const refresh = () => window.location.reload()
  const {
    fileInputRef,
    uploading,
    isOpen,
    caption,
    setCaption,
    previewUrl,
    openFilePicker,
    handleFileChange,
    closeModal,
    handleConfirmUpload,
    imageDateISO,
    setImageDateISO,
    sameAsPublish,
    setSameAsPublish,
  } = useNavbarUpload(user)

  const goHome = () => navigate('/')
  const goCountdown = () => navigate('/countdown')
  const goNotifications = () => navigate('/notifications')
  const goProfile = () =>
    user ? navigate(`/profile/${user.username || 'me'}`) : navigate('/login')
  const unread = useUnreadNotifications()

  const Desktop = () => (
    <NavbarDesktop
      bg={bg}
      borderColor={borderColor}
      textColor={textColor}
      colorMode={colorMode as 'light' | 'dark'}
      toggleColorMode={toggleColorMode}
      userProfilePic={user?.profilePic}
      uploading={uploading}
      onHome={goHome}
      onCountdown={goCountdown}
      onUpload={() => {
        if (!openFilePicker()) navigate('/login')
      }}
      onRefresh={refresh}
      onProfile={goProfile}
      onLogout={logout}
      secsToBirthday={secsToBirthday}
      notifications={{ count: unread, onOpen: goNotifications }}
    />
  )

  const Mobile = () => (
    <NavbarMobile
      bg={bg}
      borderColor={borderColor}
      uploading={uploading}
      onHome={goHome}
      onCountdown={goCountdown}
      onUpload={() => {
        if (!openFilePicker()) navigate('/login')
      }}
      onRefresh={refresh}
      onProfile={goProfile}
      userProfilePic={user?.profilePic}
      secsToBirthday={secsToBirthday}
      notifications={{ count: unread, onOpen: goNotifications }}
    />
  )

  return (
    <>
      <Desktop />
      <Mobile />
      <VisuallyHidden>
        <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
      </VisuallyHidden>
      <UploadModal
        isOpen={isOpen}
        previewUrl={previewUrl}
        caption={caption}
        onCaptionChange={setCaption}
        onCancel={closeModal}
        onConfirm={handleConfirmUpload}
        uploading={uploading}
        imageDateISO={imageDateISO}
        onImageDateChange={setImageDateISO}
        sameAsPublish={sameAsPublish}
        onSameAsPublishChange={setSameAsPublish}
      />
    </>
  )
}

export default Navbar
