import React from 'react'
import { VisuallyHidden, Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { useThemeColors } from '@estecla/hooks'

import { NavbarDesktop, NavbarMobile } from '@estecla/ui/navigation'
import UploadModal from '@components/navbar/UploadModal'
import { useNavbarUpload } from '@hooks/useNavbarUpload'
import { useUnreadNotifications } from '@estecla/hooks'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { containerBg, borderColor, textColor } = useThemeColors()
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
  const goNotifications = () => navigate('/notifications')
  const goProfile = () =>
    user ? navigate(`/profile/${user.username || 'me'}`) : navigate('/login')
  const unread = useUnreadNotifications()

  const Desktop = () => (
    <NavbarDesktop
      bg={bg}
      borderColor={borderColor}
      textColor={textColor}
      userProfilePic={user?.profilePic}
      uploading={uploading}
      onHome={goHome}
      onUpload={() => {
        if (!openFilePicker()) navigate('/login')
      }}
      onRefresh={refresh}
      onProfile={goProfile}
      onLogout={logout}
      notifications={{ count: unread, onOpen: goNotifications }}
    />
  )

  const Mobile = () => (
    <NavbarMobile
      bg={bg}
      borderColor={borderColor}
      uploading={uploading}
      onHome={goHome}
      onUpload={() => {
        if (!openFilePicker()) navigate('/login')
      }}
      onRefresh={refresh}
      onProfile={goProfile}
      userProfilePic={user?.profilePic}
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
