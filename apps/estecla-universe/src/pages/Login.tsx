// src/pages/Login.tsx
import { Box, Button, Center, FormControl, FormLabel, Heading, Input, useColorModeValue } from '@chakra-ui/react'
import { GoogleLoginButton } from '@estecla/ui/auth'
import { loginWithEmailPassword, loginWithGoogleAndEnsureUser } from '@features/auth/api/auth'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const containerBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('black', 'white')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle redirect result when user comes back from Google OAuth
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const { auth } = await import('@services/firebase')
        const { getRedirectResult } = await import('firebase/auth')
        
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('Redirect login successful, navigating to welcome page')
          navigate('/welcome')
        }
      } catch (err) {
        console.error('Redirect result error:', err)
        const message = err instanceof Error ? err.message : 'Redirect login failed'
        setError(message)
      }
    }

    handleRedirectResult()
  }, [navigate])

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
      console.log('Attempting Google login...')
      await loginWithGoogleAndEnsureUser()
      console.log('Google login successful, navigating to welcome page')
      navigate('/welcome')
    } catch (err) {
      console.error('Google login failed:', err)
      const message = err instanceof Error ? err.message : 'Google login failed'
      
      // Handle specific error cases
      if (message.includes('popup-blocked') || message.includes('popup-timeout')) {
        console.log('Popup blocked or timed out, trying redirect fallback...')
        try {
          const { auth, googleProvider } = await import('@services/firebase')
          const { signInWithRedirect, getRedirectResult } = await import('firebase/auth')
          
          // Check if there's a pending redirect result first
          const result = await getRedirectResult(auth)
          if (result) {
            console.log('Redirect result found, user logged in')
            navigate('/welcome')
            return
          }
          
          // If no pending result, initiate redirect
          await signInWithRedirect(auth, googleProvider)
          return // The page will redirect, so we don't need to handle anything else
        } catch (redirectErr) {
          console.warn('Redirect fallback also failed:', redirectErr)
          setError('Login Google non disponibile. Prova con email e password.')
        }
      } else {
        setError(message)
      }
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
