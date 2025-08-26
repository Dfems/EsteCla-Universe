import React from 'react'
import { Box, Flex, IconButton, Avatar } from '@chakra-ui/react'
import { FaHome, FaPlusSquare } from 'react-icons/fa'
import { TbRefresh } from 'react-icons/tb'
import { IoNotificationsOutline } from 'react-icons/io5'

interface MobileBarProps {
  bg: string
  borderColor: string
  uploading: boolean
  onHome: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  userProfilePic?: string | null
  notifications?: { count: number; onOpen: () => void }
}

const MobileBar: React.FC<MobileBarProps> = ({
  bg,
  borderColor,
  uploading,
  onHome,
  onUpload,
  onRefresh,
  onProfile,
  userProfilePic,
  notifications,
}) => {
  return (
    <Flex
      as="nav"
      aria-label="Barra di navigazione mobile"
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
        onClick={onHome}
      />
      <IconButton
        aria-label="Refresh"
        icon={<TbRefresh />}
        variant="ghost"
        size="lg"
        fontSize="28px"
        onClick={onRefresh}
      />
      <IconButton
        aria-label="Upload"
        icon={<FaPlusSquare />}
        variant="solid"
        colorScheme="blue"
        boxShadow="0 8px 20px rgba(0,0,0,0.25)"
        borderRadius="full"
        size="lg"
        fontSize="28px"
        onClick={onUpload}
        isLoading={uploading}
      />
      {notifications && (
        <Box position="relative">
          <IconButton
            aria-label={`Notifiche${notifications.count ? `, ${notifications.count} non lette` : ''}`}
            icon={<IoNotificationsOutline />}
            variant="ghost"
            size="lg"
            fontSize="28px"
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
      )}
      <Box
        as="button"
        aria-label="Profilo"
        onClick={onProfile}
        bg="none"
        border="none"
        p={0}
        m={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="48px"
        width="48px"
        borderRadius="full"
        _focus={{ boxShadow: 'outline' }}
      >
        <Avatar size="md" name="Profilo" src={userProfilePic || undefined} bg="gray.200" />
      </Box>
    </Flex>
  )
}

export default MobileBar
