import { Box, Text } from '@chakra-ui/react'
import { useAuth } from '@context/AuthContext'
import useThemeColors from '@hooks/useThemeColors'

export default function Home() {
  const { user } = useAuth()
  const { containerBg, textColor } = useThemeColors()

  return (
    <Box p={4} bg={containerBg} color={textColor} mt={{ base: 6, md: 6 }}>
      <Text>Benvenuto/a {user?.fullName || 'Guest'}!</Text>
      <Text mt={4}>Amo infinitamente mia moglie!</Text>
    </Box>
  )
}
