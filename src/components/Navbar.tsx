import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  Heading,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  VisuallyHidden,
  Input,
  useToast,
  Spacer,
  Button,
  Badge,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {
  FaHome,
  FaUser,
  FaPlusSquare,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaBirthdayCake,
} from 'react-icons/fa'
import { TbRefresh } from 'react-icons/tb'
import { useAuth } from '@context/AuthContext'
import useThemeColors from '@hooks/useThemeColors'
import { storage } from '@services/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const { containerBg, borderColor, textColor } = useThemeColors()
  const toast = useToast()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [secsToBirthday, setSecsToBirthday] = useState<number | null>(null)

  const bg = containerBg

  const refresh = () => window.location.reload()

  const openFilePicker = () => {
    if (!user) return navigate('/login')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const path = `uploads/${user.uid}/${Date.now()}-${file.name}`
      const fileRef = ref(storage, path)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      toast({
        status: 'success',
        title: 'Immagine caricata',
        description: 'URL copiato negli appunti',
      })
      await navigator.clipboard.writeText(url).catch(() => {})
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload fallito'
      toast({ status: 'error', title: 'Errore upload', description: message })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
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

  const DesktopBar = () => (
    <>
      <Flex
        display={{ base: 'none', md: 'flex' }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="64px"
        bg={bg}
        borderBottomWidth="1px"
        borderColor={borderColor}
        align="center"
        px={4}
        zIndex={1000}
      >
        <HStack spacing={3} cursor="pointer" onClick={goHome}>
          <Heading size="md" color={textColor} fontFamily="cursive">
            EsteCla
          </Heading>
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <Tooltip label="Home">
            <IconButton aria-label="Home" icon={<FaHome />} variant="ghost" onClick={goHome} />
          </Tooltip>
          <Tooltip label="Countdown">
            <Box position="relative">
              <IconButton
                aria-label="Countdown"
                icon={<FaBirthdayCake />}
                variant="ghost"
                onClick={goCountdown}
              />
              {renderBirthdayBadge()}
            </Box>
          </Tooltip>
          <Tooltip label="Upload">
            <IconButton
              aria-label="Upload"
              icon={<FaPlusSquare />}
              variant="ghost"
              onClick={openFilePicker}
              isDisabled={uploading}
            />
          </Tooltip>
          <Tooltip label="Refresh">
            <IconButton
              aria-label="Refresh"
              icon={<TbRefresh />}
              variant="ghost"
              onClick={refresh}
            />
          </Tooltip>
          <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              variant="ghost"
              onClick={toggleColorMode}
            />
          </Tooltip>
          <Menu>
            <MenuButton as={Button} variant="ghost" p={0} minW={0} aria-label="User menu">
              <Avatar size="sm" src={user?.profilePic} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaUser />} onClick={goProfile}>
                Profilo
              </MenuItem>
              <MenuItem icon={<FaSignOutAlt />} onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
      <Box display={{ base: 'none', md: 'block' }} height="64px" />
    </>
  )

  const MobileBar = () => (
    <>
      <Flex
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height="64px"
        bg={bg}
        borderTopWidth="1px"
        borderColor={borderColor}
        align="center"
        justify="space-around"
        px={2}
        zIndex={1400}
        pb="env(safe-area-inset-bottom)"
      >
        <IconButton aria-label="Home" icon={<FaHome />} variant="ghost" onClick={goHome} />
        <Box position="relative">
          <IconButton
            aria-label="Countdown"
            icon={<FaBirthdayCake />}
            variant="ghost"
            onClick={goCountdown}
          />
          {renderBirthdayBadge()}
        </Box>
        <Box position="relative" top={-4}>
          <IconButton
            aria-label="Upload"
            icon={<FaPlusSquare />}
            variant="solid"
            colorScheme="blue"
            boxShadow="0 8px 20px rgba(0,0,0,0.25)"
            borderRadius="full"
            size="lg"
            onClick={openFilePicker}
            isLoading={uploading}
          />
        </Box>
        <IconButton aria-label="Refresh" icon={<TbRefresh />} variant="ghost" onClick={refresh} />
        <IconButton aria-label="Profilo" icon={<FaUser />} variant="ghost" onClick={goProfile} />
      </Flex>
      <Box display={{ base: 'block', md: 'none' }} height="72px" />
    </>
  )

  return (
    <>
      <DesktopBar />
      <MobileBar />
      <VisuallyHidden>
        <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
      </VisuallyHidden>
    </>
  )
}

export default Navbar
