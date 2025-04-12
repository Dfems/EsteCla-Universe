import { Box, Text } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <Box p={4}>
      <Text>Benvenuto/a {user?.fullName || 'Guest'}!</Text>
      <Text mt={4}>Amo infinitamente mia moglie!</Text>
    </Box>
  )
}
