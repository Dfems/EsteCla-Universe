// src/pages/Register.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Center, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import { UserInfo } from '../types/interfaces'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1) Creiamo l'account su Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // 2) Creiamo il documento utente su Firestore
      const userData: UserInfo = {
        uid: firebaseUser.uid,
        username,
        fullName,
        profilePic,
        bio: '',
        followers: [],
        following: [],
      }
      await setDoc(doc(db, 'users', firebaseUser.uid), userData)

      // 3) Reindirizziamo in app
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Center minH="100vh" bg="gray.50">
      <Box
        as="form"
        onSubmit={handleRegister}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
        maxW="400px"
      >
        <Heading size="lg" mb={6}>
          Register
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

        <FormControl isRequired mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
          />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Full Name</FormLabel>
          <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>Profile Picture (URL)</FormLabel>
          <Input type="text" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          loadingText="Registering..."
          w="100%"
          mb={4}
        >
          Register
        </Button>

        <Button variant="outline" w="100%" onClick={() => navigate('/login')}>
          Hai già un account? Fai il Login
        </Button>
      </Box>
    </Center>
  )
}

export default Register
