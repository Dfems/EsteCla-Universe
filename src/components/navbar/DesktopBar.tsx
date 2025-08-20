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
import { FaBirthdayCake, FaHome, FaMoon, FaPlusSquare, FaSun, FaUser } from 'react-icons/fa'
import { TbRefresh } from 'react-icons/tb'

interface DesktopBarProps {
  bg: string
  borderColor: string
  textColor: string
  colorMode: 'light' | 'dark'
  toggleColorMode: () => void
  userProfilePic?: string
  uploading: boolean
  onHome: () => void
  onCountdown: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  onLogout: () => void
  renderBirthdayBadge?: () => React.ReactNode
}

const DesktopBar: React.FC<DesktopBarProps> = ({
  bg,
  borderColor,
  textColor,
  colorMode,
  toggleColorMode,
  userProfilePic,
  uploading,
  onHome,
  onCountdown,
  onUpload,
  onRefresh,
  onProfile,
  onLogout,
  renderBirthdayBadge,
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
          <Tooltip label="Countdown">
            <Box position="relative">
              <IconButton
                aria-label="Countdown"
                icon={<FaBirthdayCake />}
                variant="ghost"
                onClick={onCountdown}
              />
              {renderBirthdayBadge?.()}
            </Box>
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

export default DesktopBar
