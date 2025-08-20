import React, { useEffect, useRef, useState } from 'react'
import { useColorMode, VisuallyHidden, Input, useToast, Badge } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import useThemeColors from '@hooks/useThemeColors'
import DesktopBar from './navbar/DesktopBar'
import MobileBar from './navbar/MobileBar'
import UploadModal from './navbar/UploadModal'
import { useUploadPost } from '@hooks/useUploadPost'
// icons handled inside DesktopBar; no direct usage here

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const { containerBg, borderColor, textColor } = useThemeColors()
  const toast = useToast()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [secsToBirthday, setSecsToBirthday] = useState<number | null>(null)
  const {
    isOpen,
    caption,
    setCaption,
    previewUrl,
    uploading: modalUploading,
    pickFile,
    cancel,
    confirmUpload,
  } = useUploadPost()

  const bg = containerBg

  const refresh = () => window.location.reload()

  const openFilePicker = () => {
    if (!user) return navigate('/login')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    pickFile(file)
  }

  const closeModal = () => {
    cancel()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleConfirmUpload = async () => {
    if (!user) return
    setUploading(true)
    try {
      const url = await confirmUpload(user.uid)
      toast({
        status: 'success',
        title: 'Post pubblicato',
        description: 'URL copiato negli appunti',
      })
      await navigator.clipboard.writeText(url).catch(() => {})
      closeModal()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload fallito'
      toast({ status: 'error', title: 'Errore upload', description: message })
    } finally {
      setUploading(false)
    }
  }

  const goHome = () => navigate('/')
  const goCountdown = () => navigate('/countdown')
  const goProfile = () =>
    user ? navigate(`/profile/${user.username || 'me'}`) : navigate('/login')

  // Compute seconds until next birthday; update every minute
  useEffect(() => {
    const compute = () => {
      if (!user?.birthday) {
        setSecsToBirthday(null)
        return
      }
      const [y, m, d] = user.birthday.split('-').map((n) => parseInt(n, 10))
      if (!y || !m || !d) {
        setSecsToBirthday(null)
        return
      }
      const now = new Date()
      const currentYear = now.getFullYear()
      let next = new Date(currentYear, m - 1, d, 0, 0, 0, 0)
      if (next.getTime() < now.getTime()) {
        next = new Date(currentYear + 1, m - 1, d, 0, 0, 0, 0)
      }
      const secs = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000))
      setSecsToBirthday(secs)
    }
    compute()
    const id = setInterval(compute, 60_000)
    return () => clearInterval(id)
  }, [user?.birthday])

  const renderBirthdayBadge = () => {
    if (secsToBirthday == null || secsToBirthday >= 86_400) return null
    const hours = Math.floor(secsToBirthday / 3600)
    const minutes = Math.floor((secsToBirthday % 3600) / 60)
    const label = hours >= 1 ? `${hours}h` : `${minutes}m`
    return (
      <Badge
        position="absolute"
        top={-1}
        right={-1}
        colorScheme="pink"
        borderRadius="full"
        fontSize="0.6rem"
        px={2}
        py={0.5}
      >
        {label}
      </Badge>
    )
  }

  const Desktop = () => (
    <DesktopBar
      bg={bg}
      borderColor={borderColor}
      textColor={textColor}
      colorMode={colorMode}
      toggleColorMode={toggleColorMode}
      userProfilePic={user?.profilePic}
      uploading={uploading}
      onHome={goHome}
      onCountdown={goCountdown}
      onUpload={openFilePicker}
      onRefresh={refresh}
      onProfile={goProfile}
      onLogout={logout}
      renderBirthdayBadge={renderBirthdayBadge}
    />
  )

  const Mobile = () => (
    <MobileBar
      bg={bg}
      borderColor={borderColor}
      uploading={uploading}
      onHome={goHome}
      onCountdown={goCountdown}
      onUpload={openFilePicker}
      onRefresh={refresh}
      onProfile={goProfile}
      renderBirthdayBadge={renderBirthdayBadge}
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
        uploading={modalUploading || uploading}
      />
    </>
  )
}

export default Navbar
