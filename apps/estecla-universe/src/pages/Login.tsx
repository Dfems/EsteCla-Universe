// src/pages/Login.tsx
import { Box, Button, Center, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { useThemeColors } from '@estecla/hooks'
import { GoogleLoginButton } from '@estecla/ui/auth'
import { loginWithEmailPassword, loginWithGoogleAndEnsureUser } from '@features/auth/api/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const { containerBg, textColor } = useThemeColors()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginWithEmailPassword(email, password)
      navigate('/welcome')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      // const { auth, googleProvider } = await import('@services/firebase')
      // const { signInWithPopup } = await import('firebase/auth')
      // console.log('Using signInWithPopup for Google login')
      // await signInWithPopup(auth, googleProvider)
      await loginWithGoogleAndEnsureUser()
      navigate('/welcome')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed'
      // Fallback to redirect if popup fails (e.g., due to popup blockers)
      if (
        message.startsWith('auth/popup-timeout') ||
        message.startsWith('auth/cancelled-popup-request') ||
        message.startsWith('auth/popup-blocked')
      ) {
        try {
          const { auth, googleProvider } = await import('@services/firebase')
          const { signInWithRedirect } = await import('firebase/auth')
          await signInWithRedirect(auth, googleProvider)
          return
        } catch (redirErr) {
          console.warn('Redirect fallback failed', redirErr)
        }
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Center minH="100vh" bg={containerBg} color={textColor}>
      <Box
        as="form"
        onSubmit={handleEmailLogin}
        bg={containerBg}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
        maxW="400px"
      >
        <Heading size="lg" mb={6}>
          Login
        </Heading>

        {error && (
          <Box color="red.500" mb={4}>
            {error}
          </Box>
        )}

        <FormControl isRequired mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormControl>

        <FormControl isRequired mb={6}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          loadingText="Logging in..."
          w="100%"
          mb={4}
        >
          Login
        </Button>

        <GoogleLoginButton onClick={handleGoogleLogin} isLoading={loading}></GoogleLoginButton>

        <Button
          variant="outline"
          w="100%"
          onMouseEnter={() => import('@pages/Register')}
          onClick={() => navigate('/register')}
        >
          Non hai un account? Registrati
        </Button>
      </Box>
    </Center>
  )
}

export default Login
