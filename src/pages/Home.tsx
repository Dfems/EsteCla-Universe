import { Box, Text } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <Box p={4}>
      <Text fontSize="2xl">Welcome {user?.fullName || 'Guest'}!</Text>
      <Text mt={4}>Posts will appear here...</Text>
    </Box>
  )
}
