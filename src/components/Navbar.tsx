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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Image,
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
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@services/firebase'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const { containerBg, borderColor, textColor } = useThemeColors()
  const toast = useToast()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [secsToBirthday, setSecsToBirthday] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const bg = containerBg

  const refresh = () => window.location.reload()

  const openFilePicker = () => {
    if (!user) return navigate('/login')
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setSelectedFile(file)
    setCaption('')
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCaption('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleConfirmUpload = async () => {
    if (!user || !selectedFile) return
    setUploading(true)
    try {
      const path = `uploads/${user.uid}/${Date.now()}-${selectedFile.name}`
      const fileRef = ref(storage, path)
      await uploadBytes(fileRef, selectedFile)
      const url = await getDownloadURL(fileRef)

      // Crea il post nel Firestore sotto l'utente
      await addDoc(collection(db, 'users', user.uid, 'posts'), {
        imageUrl: url,
        caption: caption?.trim() || '',
        createdAt: serverTimestamp(),
      })

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
        height="88px"
        bg={bg}
        borderTopWidth="1px"
        borderColor={borderColor}
        align="flex-start"
        justify="space-around"
        px={3}
        pt={2}
        zIndex={1400}
        pb="calc(env(safe-area-inset-bottom) + 12px)"
        overflow="hidden"
      >
        <IconButton
          aria-label="Home"
          icon={<FaHome />}
          variant="ghost"
          size="lg"
          fontSize="28px"
          onClick={goHome}
        />
        <Box position="relative">
          <IconButton
            aria-label="Countdown"
            icon={<FaBirthdayCake />}
            variant="ghost"
            size="lg"
            fontSize="28px"
            onClick={goCountdown}
          />
          {renderBirthdayBadge()}
        </Box>
        <Box position="relative">
          <IconButton
            aria-label="Upload"
            icon={<FaPlusSquare />}
            variant="solid"
            colorScheme="blue"
            boxShadow="0 8px 20px rgba(0,0,0,0.25)"
            borderRadius="full"
            size="lg"
            fontSize="28px"
            onClick={openFilePicker}
            isLoading={uploading}
          />
        </Box>
        <IconButton
          aria-label="Refresh"
          icon={<TbRefresh />}
          variant="ghost"
          size="lg"
          fontSize="28px"
          onClick={refresh}
        />
        <IconButton
          aria-label="Profilo"
          icon={<FaUser />}
          variant="ghost"
          size="lg"
          fontSize="28px"
          onClick={goProfile}
        />
      </Flex>
    </>
  )

  return (
    <>
      <DesktopBar />
      <MobileBar />
      <VisuallyHidden>
        <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
      </VisuallyHidden>

      {/* Modal descrizione post */}
      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuovo post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="preview"
                borderRadius="md"
                mb={3}
                maxH="300px"
                objectFit="cover"
                w="100%"
              />
            ) : null}
            <Textarea
              placeholder="Scrivi una descrizione..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeModal} isDisabled={uploading}>
              Annulla
            </Button>
            <Button colorScheme="blue" onClick={handleConfirmUpload} isLoading={uploading}>
              Pubblica
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Navbar
