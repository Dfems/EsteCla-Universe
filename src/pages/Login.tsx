// src/pages/Login.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Center, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { loginWithEmailPassword, loginWithGoogleAndEnsureUser } from '@features/auth/api/auth'
import GoogleLoginButton from '@components/ui/GoogleLoginButton'
import useThemeColors from '@hooks/useThemeColors'
// import { useColorMode } from '@chakra-ui/react'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { containerBg, textColor } = useThemeColors()
  // const { toggleColorMode } = useColorMode()
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
      navigate('/')
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
      await loginWithGoogleAndEnsureUser()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
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

        {/* <Button onClick={toggleColorMode} mb={4}>
          Cambia Modalità
        </Button> */}

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
