// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  VStack,
} from '@chakra-ui/react'
import { auth, googleProvider } from '../services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import GoogleLoginButton from '../components/GoogleLoginButton'

const Login = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      navigate('/')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Google login failed')
    }
  }

  return (
    <Center minH="100vh" bg="gray.50">
      <VStack
        as="form"
        onSubmit={handleSubmit}
        spacing={4}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
        maxW="400px"
      >
        <Heading size="lg">{isLogin ? 'Login' : 'Sign Up'}</Heading>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            minLength={6}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          w="100%"
          isLoading={loading}
          loadingText={isLogin ? 'Logging in...' : 'Signing up...'}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>

        <Flex align="center" w="100%" gap={2}>
          <Box position="relative" padding="10">
            <Divider />
            <AbsoluteCenter bg="white" px="4">
              OR
            </AbsoluteCenter>
          </Box>
        </Flex>

        <GoogleLoginButton onClick={handleGoogleLogin} />
        <div>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link color="blue.500" onClick={() => setIsLogin(!isLogin)} textDecoration="underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </Link>
        </div>
      </VStack>
    </Center>
  )
}

export default Login
