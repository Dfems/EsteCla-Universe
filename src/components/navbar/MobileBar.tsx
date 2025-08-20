import React from 'react'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import { FaBirthdayCake, FaHome, FaPlusSquare, FaUser } from 'react-icons/fa'
import { TbRefresh } from 'react-icons/tb'

interface MobileBarProps {
  bg: string
  borderColor: string
  uploading: boolean
  onHome: () => void
  onCountdown: () => void
  onUpload: () => void
  onRefresh: () => void
  onProfile: () => void
  renderBirthdayBadge?: () => React.ReactNode
}

const MobileBar: React.FC<MobileBarProps> = ({
  bg,
  borderColor,
  uploading,
  onHome,
  onCountdown,
  onUpload,
  onRefresh,
  onProfile,
  renderBirthdayBadge,
}) => {
  return (
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
        onClick={onHome}
      />
      <Box position="relative">
        <IconButton
          aria-label="Countdown"
          icon={<FaBirthdayCake />}
          variant="ghost"
          size="lg"
          fontSize="28px"
          onClick={onCountdown}
        />
        {renderBirthdayBadge?.()}
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
          onClick={onUpload}
          isLoading={uploading}
        />
      </Box>
      <IconButton
        aria-label="Refresh"
        icon={<TbRefresh />}
        variant="ghost"
        size="lg"
        fontSize="28px"
        onClick={onRefresh}
      />
      <IconButton
        aria-label="Profilo"
        icon={<FaUser />}
        variant="ghost"
        size="lg"
        fontSize="28px"
        onClick={onProfile}
      />
    </Flex>
  )
}

export default MobileBar
