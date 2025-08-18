// src/pages/Login.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Center, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { signInWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../services/firebase'
import GoogleLoginButton from '../components/GoogleLoginButton'
import useThemeColors from '../hooks/useThemeColors'
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
      // 1) Login con email/password
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // 2) Verifica documento utente su Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userDocRef)

      if (snap.exists()) {
        navigate('/')
      } else {
        await signOut(auth)
        setError('Account non registrato. Registrati prima di accedere.')
      }
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
      // 1) Login con Google
      const userCredential = await signInWithPopup(auth, googleProvider)
      const firebaseUser = userCredential.user

      // 2) Verifica documento utente su Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userDocRef)

      if (!snap.exists()) {
        // Se non esiste, creiamo automaticamente il documento utente
        const newUser = {
          uid: firebaseUser.uid,
          // Utilizziamo displayName o, in mancanza, una username derivata dall'email
          username: firebaseUser.email?.split('@')[0] || '',
          fullName: firebaseUser.displayName || '',
          profilePic: firebaseUser.photoURL || '',
          bio: '',
          followers: [],
          following: [],
        }
        await setDoc(userDocRef, newUser)
      }
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

        <Button variant="outline" w="100%" onClick={() => navigate('/register')}>
          Non hai un account? Registrati
        </Button>
      </Box>
    </Center>
  )
}

export default Login
