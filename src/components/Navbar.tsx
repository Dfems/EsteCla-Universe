import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
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
import {
  SearchIcon,
  HamburgerIcon,
  AddIcon,
  BellIcon,
  MoonIcon,
  DownloadIcon,
  ArrowForwardIcon, // Importato per il logout
} from '@chakra-ui/icons'
import { useAuth } from '../context/AuthContext'
import { usePWA } from '../hooks/usePWA'

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })
  usePWA()

  const navItems = [
    { icon: <MoonIcon boxSize={6} />, path: '/', label: 'Home' },
    { icon: <AddIcon boxSize={6} />, path: '/create', label: 'Create' },
    { icon: <BellIcon boxSize={6} />, path: '/activity', label: 'Notifications' },
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
        boxShadow="sm" // Aggiunta una leggera ombra per maggiore eleganza
      >
        {/* Logo Section */}
        <Link to="/">
          <Flex align="center" gap={2}>
            {!isMobile && (
              <Heading size="md" fontFamily="cursive">
                EsteCla
              </Heading>
            )}
          </Flex>
        </Link>

        {/* Search Bar (Desktop) */}
        {!isMobile && (
          <InputGroup maxW="600px" mx={4} flex={2}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search users and posts..."
              borderRadius="full"
              onClick={() => navigate('/search')}
              _focus={{ boxShadow: 'none' }}
            />
          </InputGroup>
        )}

        <Flex flex={1} justifyContent="flex-end" gap={{ base: 1, md: 4 }}>
          {isMobile ? (
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              onClick={onOpen}
              size="sm"
            />
          ) : (
            <>
              {navItems.map((item, index) => (
                <IconButton
                  key={index}
                  aria-label={item.label}
                  icon={item.icon}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  fontSize="xl"
                />
              ))}

              <IconButton
                id="install-button"
                aria-label="Install app"
                icon={<DownloadIcon />}
                variant="ghost"
                display="none"
              />

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
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </Flex>
              )}
            </>
          )}
        </Flex>
      </Flex>

      {/* Mobile Drawer */}
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
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    justifyContent="flex-start"
                    leftIcon={item.icon}
                    onClick={() => {
                      navigate(item.path)
                      onClose()
                    }}
                    height="48px"
                    borderRadius="md"
                  >
                    {item.label}
                  </Button>
                ))}

                <Button
                  id="install-button-mobile"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<DownloadIcon />}
                  display="none"
                  height="48px"
                  borderRadius="md"
                >
                  Install App
                </Button>

                {user && (
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    leftIcon={<ArrowForwardIcon />}
                    onClick={() => {
                      handleLogout()
                      onClose()
                    }}
                    height="48px"
                    borderRadius="md"
                  >
                    Logout
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
