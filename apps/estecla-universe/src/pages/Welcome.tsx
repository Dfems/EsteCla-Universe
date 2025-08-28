import { Box, Button, Container, Heading, HStack, Text } from '@chakra-ui/react'
import { useAuth } from '@estecla/firebase-react'
import { useThemeColors } from '@estecla/hooks'
import { useWelcomeGate } from '@hooks/useWelcomeGate'
import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box)

export default function Welcome() {
  const { user } = useAuth()
  const { containerBg, textColor } = useThemeColors()
  const navigate = useNavigate()
  const { setLastSeenNow, shouldShowWelcome, setSnoozeUntilEndOfDay } = useWelcomeGate()
  const envAutoMs = Number(import.meta.env.VITE_WELCOME_AUTO_CONTINUE_MS)
  const AUTO_CONTINUE_MS = Number.isFinite(envAutoMs) && envAutoMs > 0 ? envAutoMs : 4000

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 5) return 'Buona notte'
    if (hour < 12) return 'Buongiorno'
    if (hour < 18) return 'Buon pomeriggio'
    return 'Buonasera'
  }, [])

  useEffect(() => {
    // If welcome is not needed (e.g., direct nav), skip instantly
    if (!shouldShowWelcome()) {
      navigate('/', { replace: true })
      return
    }
    const t = setTimeout(() => handleContinue(), AUTO_CONTINUE_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleContinue = () => {
    setLastSeenNow()
    navigate('/', { replace: true })
  }

  const handleSnoozeToday = () => {
    setSnoozeUntilEndOfDay()
    setLastSeenNow()
    navigate('/', { replace: true })
  }

  return (
    <Box minH="calc(100dvh)" bg={containerBg} color={textColor} display="flex" alignItems="center">
      <Container maxW="container.md" textAlign="center">
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="lg" mb={2}>
            {greeting}
            {user?.fullName ? `, ${user.fullName}` : user?.username ? `, ${user.username}` : ''}!
          </Heading>
          <Text fontSize="md" opacity={0.85} mb={6}>
            Bentornat{user?.fullName || user?.username ? 'ə' : 'o/a'} su EsteCla Universe.
          </Text>
          <HStack spacing={3} justify="center">
            <Button colorScheme="teal" onClick={handleContinue}>
              Entra
            </Button>
            <Button variant="ghost" onClick={handleSnoozeToday}>
              Non mostrare più oggi
            </Button>
          </HStack>
        </MotionBox>
      </Container>
    </Box>
  )
}
