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
  useColorMode,
  useColorModeValue, // Importa anche useColorModeValue
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome, FaBars, FaSignOutAlt, FaBirthdayCake, FaSun, FaMoon } from 'react-icons/fa'
import { TbRefresh } from 'react-icons/tb'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { colorMode, toggleColorMode } = useColorMode()

  // Definisci colori dinamici in base al tema
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.100', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const textColorSecondary = useColorModeValue('gray.500', 'gray.300')

  // Funzione per svuotare la cache e ricaricare la pagina
  const clearCacheAndReload = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((name) => caches.delete(name)))
      }
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    } catch (error) {
      console.error('Errore durante lo svuotamento della cache:', error)
    }
  }

  // Elementi per la navbar desktop
  const navItemsDesktop = [
    { icon: <FaHome size={24} />, path: '/', label: 'Home' },
    { icon: <FaBirthdayCake size={18} />, path: '/countdown', label: 'Countdown' },
    { icon: <TbRefresh size={24} />, onClick: clearCacheAndReload, label: 'Clear Cache' },
    {
      icon: colorMode === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />,
      onClick: toggleColorMode,
      label: colorMode === 'light' ? 'Dark Mode' : 'Light Mode',
    },
  ]

  // Elementi per il Drawer mobile (sidebar)
  const navItemsMobileSidebar = [
    { icon: <FaHome size={24} />, path: '/', label: 'Home' },
    { icon: <FaBirthdayCake size={24} />, path: '/countdown', label: 'Birthday' },
    {
      icon: colorMode === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />,
      onClick: toggleColorMode,
      label: colorMode === 'light' ? 'Dark Mode' : 'Light Mode',
    },
  ]

  // Elementi per la navbar mobile (parte superiore)
  const navItemsMobileNavbar = [
    { icon: <FaHome size={22} />, path: '/', label: 'Home' },
    { icon: <TbRefresh size={22} />, onClick: clearCacheAndReload, label: 'Clear Cache' },
    { icon: <FaBars size={20} />, path: 'menu', label: 'Menu' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Flex
        p={{ base: 2, md: 4 }}
        bg={bg} // usa il colore dinamico di background
        borderBottom="1px"
        borderColor={borderColor} // usa il colore dinamico per il bordo
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="sticky"
        alignItems="center"
        height="60px"
        boxShadow="sm"
      >
        {/* Logo Section */}
        <Link to="/">
          <Flex
            align="center"
            gap={2}
            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
          >
            {!isMobile && (
              <Heading size="md" fontFamily="cursive" color={textColor}>
                EsteCla
              </Heading>
            )}
          </Flex>
        </Link>

        {/* Navbar Desktop */}
        {!isMobile && (
          <Flex flex={1} justifyContent="flex-end" gap={4}>
            {navItemsDesktop.map((item, index) => (
              <IconButton
                key={index}
                aria-label={item.label}
                icon={item.icon}
                variant="ghost"
                onClick={() => {
                  if (item.onClick) {
                    item.onClick()
                  } else {
                    navigate(item.path)
                  }
                }}
                fontSize="xl"
                _hover={{ transform: 'scale(1.1)', transition: 'transform 0.2s' }}
              />
            ))}

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
                <Button variant="outline" size="sm" onClick={handleLogout} _hover={{ bg: hoverBg }}>
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
                  if (item.onClick) {
                    item.onClick()
                  } else if (item.label === 'Menu') {
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
        <DrawerContent bg={bg}>
          <DrawerBody mt={8}>
            {user && (
              <Link to={`/profile/${user.username}`}>
                <Flex align="center" p={2} _hover={{ bg: hoverBg }} borderRadius="md">
                  <Avatar src={user.profilePic} />
                  <Box ml={3}>
                    <Text fontWeight="bold" color={textColor}>
                      {user.username}
                    </Text>
                    <Text fontSize="sm" color={textColorSecondary}>
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
                    if (item.onClick) {
                      item.onClick()
                    } else {
                      navigate(item.path)
                    }
                    onClose()
                  }}
                  height="48px"
                  borderRadius="md"
                  _hover={{ bg: hoverBg }}
                >
                  <Flex align="center" gap={3}>
                    <Box w="24px" display="flex" justifyContent="center">
                      {item.icon}
                    </Box>
                    <Text>{item.label}</Text>
                  </Flex>
                </Button>
              ))}

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
                  _hover={{ bg: hoverBg }}
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Navbar
