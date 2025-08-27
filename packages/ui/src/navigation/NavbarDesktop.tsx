import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tooltip,
} from '@chakra-ui/react'
import { FaHome, FaPlusSquare, FaUser } from 'react-icons/fa'
import { IoNotificationsOutline } from 'react-icons/io5'
import { TbRefresh } from 'react-icons/tb'

export interface NavbarDesktopProps {
  bg: string
  borderColor: string
  textColor: string
  userProfilePic?: string
  uploading: boolean
  onHome: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  onLogout: () => void
  notifications?: { count: number; onOpen: () => void }
}

const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  bg,
  borderColor,
  textColor,
  userProfilePic,
  uploading,
  onHome,
  onUpload,
  onRefresh,
  onProfile,
  onLogout,
  notifications,
}) => {
  return (
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
        <HStack spacing={3} cursor="pointer" onClick={onHome}>
          <Heading size="md" color={textColor} fontFamily="cursive">
            EsteCla
          </Heading>
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <Tooltip label="Home">
            <IconButton aria-label="Home" icon={<FaHome />} variant="ghost" onClick={onHome} />
          </Tooltip>
          <Tooltip label="Upload">
            <IconButton
              aria-label="Upload"
              icon={<FaPlusSquare />}
              variant="ghost"
              onClick={onUpload}
              isDisabled={uploading}
            />
          </Tooltip>
          <Tooltip label="Refresh">
            <IconButton
              aria-label="Refresh"
              icon={<TbRefresh />}
              variant="ghost"
              onClick={onRefresh}
            />
          </Tooltip>
          {notifications && (
            <Tooltip label="Notifiche">
              <Box position="relative">
                <IconButton
                  aria-label={`Notifiche${notifications.count ? `, ${notifications.count} non lette` : ''}`}
                  icon={<IoNotificationsOutline />}
                  variant="ghost"
                  onClick={notifications.onOpen}
                />
                {notifications.count > 0 && (
                  <Box
                    position="absolute"
                    top={1}
                    right={1}
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="10px"
                    minW="16px"
                    h="16px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    px={1}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {notifications.count > 9 ? '9+' : notifications.count}
                  </Box>
                )}
              </Box>
            </Tooltip>
          )}
          <Menu>
            <MenuButton as={Button} variant="ghost" p={0} minW={0} aria-label="User menu">
              <Avatar size="sm" src={userProfilePic} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaUser />} onClick={onProfile}>
                Profilo
              </MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
      <Box display={{ base: 'none', md: 'block' }} height="64px" />
    </>
  )
}

export default NavbarDesktop
