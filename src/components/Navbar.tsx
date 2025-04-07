import {
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  VStack,
  Avatar,
  Box,
  Text,
  useBreakpointValue,
  Button,
  Heading,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome, FaPlus, FaBell, FaDownload, FaBars, FaSignOutAlt, FaApple } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { usePWA } from '../hooks/usePWA'

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { isInstallable, handleInstall, isIOS, showIOSInstallPrompt } = usePWA()

  // Elementi per la navbar desktop
  const navItemsDesktop = [
    { icon: <FaHome size={24} />, path: '/', label: 'Home' },
    { icon: <FaPlus size={24} />, path: '/create', label: 'Create' },
    { icon: <FaBell size={24} />, path: '/activities', label: 'Notifications' },
    { icon: <FaApple size={24} />, path: '/countdown', label: 'Countdown' },
  ]

  // Elementi per il Drawer mobile (sidebar)
  const navItemsMobileSidebar = [
    { icon: <FaHome size={24} />, path: '/', label: 'Home' },
    { icon: <FaPlus size={24} />, path: '/create', label: 'Create' },
  ]

  // Elementi per la navbar mobile (parte superiore)
  const navItemsMobileNavbar = [
    { icon: <FaBell size={18} />, path: '/activities', label: 'Notifications' },
    { icon: <FaApple size={24} />, path: '/countdown', label: 'Countdown' },
    { icon: <FaBars size={18} />, path: 'menu', label: 'Menu' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Flex
        p={{ base: 2, md: 4 }}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="sticky"
        alignItems="center"
        height="60px"
        boxShadow="sm"
      >
        <Text color="gray.500" fontSize="sm">
          PWA Status: {isInstallable ? 'Ins' : 'Not Ins'}
        </Text>

        {/* Logo Section */}
        <Link to="/">
          <Flex
            align="center"
            gap={2}
            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
          >
            {!isMobile && (
              <Heading size="md" fontFamily="cursive">
                EsteCla
              </Heading>
            )}
          </Flex>
        </Link>

        {/* Search Bar (solo desktop) */}
        {/* {!isMobile && (
          <InputGroup maxW="600px" mx={4} flex={2}>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search users and posts..."
              borderRadius="full"
              onClick={() => navigate('/search')}
              _focus={{ boxShadow: 'outline' }}
            />
          </InputGroup>
        )} */}

        {/* Navbar Desktop */}
        {!isMobile && (
          <Flex flex={1} justifyContent="flex-end" gap={4}>
            {navItemsDesktop.map((item, index) => (
              <IconButton
                key={index}
                aria-label={item.label}
                icon={item.icon}
                variant="ghost"
                onClick={() => navigate(item.path)}
                fontSize="xl"
                _hover={{ transform: 'scale(1.1)', transition: 'transform 0.2s' }}
              />
            ))}

            {/* Bottone Install App visibile solo se l'app è installabile */}
            {isInstallable && (
              <IconButton
                id="install-button"
                aria-label="Install app"
                icon={<FaDownload size={18} />}
                variant="ghost"
                onClick={handleInstall}
                _hover={{ transform: 'scale(1.1)', transition: 'transform 0.2s' }}
              />
            )}

            {/* Pulsante specifico per iOS */}
            {isIOS && (
              <IconButton
                aria-label="Installa su iOS"
                icon={<FaApple />}
                onClick={showIOSInstallPrompt}
                variant="ghost"
              />
            )}

            {user && (
              <Flex align="center" gap={3}>
                <Link to={`/profile/${user.username}`}>
                  <Avatar
                    size="sm"
                    src={user.profilePic}
                    name={user.username}
                    _hover={{ transform: 'scale(1.1)' }}
                    transition="transform 0.2s"
                  />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  _hover={{ bg: 'gray.100' }}
                >
                  Logout
                </Button>
              </Flex>
            )}
          </Flex>
        )}

        {/* Navbar Mobile */}
        {isMobile && (
          <Flex flex={1} justifyContent="flex-end" gap={2}>
            {navItemsMobileNavbar.map((item, index) => (
              <IconButton
                key={index}
                aria-label={item.label}
                icon={item.icon}
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (item.label === 'Menu') {
                    onOpen()
                  } else {
                    navigate(item.path)
                  }
                }}
                _hover={{ transform: 'scale(1.1)', transition: 'transform 0.2s' }}
              />
            ))}
          </Flex>
        )}
      </Flex>

      {/* Mobile Drawer Sidebar */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody mt={8}>
            <VStack spacing={4} align="stretch">
              {user && (
                <Link to={`/profile/${user.username}`}>
                  <Flex align="center" p={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
                    <Avatar src={user.profilePic} />
                    <Box ml={3}>
                      <Text fontWeight="bold">{user.username}</Text>
                      <Text fontSize="sm" color="gray.500">
                        View Profile
                      </Text>
                    </Box>
                  </Flex>
                </Link>
              )}

              <VStack spacing={1} align="stretch">
                {navItemsMobileSidebar.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      navigate(item.path)
                      onClose()
                    }}
                    height="48px"
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                  >
                    <Flex align="center" gap={3}>
                      <Box w="24px" display="flex" justifyContent="center">
                        {item.icon}
                      </Box>
                      <Text>{item.label}</Text>
                    </Flex>
                  </Button>
                ))}

                {/* Bottone Install App per mobile */}
                {isInstallable && (
                  <Button
                    id="install-button-mobile"
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={handleInstall}
                    height="48px"
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                  >
                    <Flex align="center" gap={3}>
                      <Box w="24px" display="flex" justifyContent="center">
                        <FaDownload size={18} />
                      </Box>
                      <Text>Install App</Text>
                    </Flex>
                  </Button>
                )}

                {user && (
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => {
                      handleLogout()
                      onClose()
                    }}
                    height="48px"
                    borderRadius="md"
                    _hover={{ bg: 'gray.100' }}
                  >
                    <Flex align="center" gap={3}>
                      <Box w="24px" display="flex" justifyContent="center">
                        <FaSignOutAlt size={18} />
                      </Box>
                      <Text>Logout</Text>
                    </Flex>
                  </Button>
                )}
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Navbar
