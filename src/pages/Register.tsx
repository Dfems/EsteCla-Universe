// src/pages/Register.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Center, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { registerWithEmailPassword } from '@features/auth/api/auth'
import type { UserInfo } from '@models/interfaces'
import useThemeColors from '@hooks/useThemeColors'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { containerBg, textColor } = useThemeColors()
  // const { toggleColorMode } = useColorMode()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const calculateAge = (dateStr: string) => {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return NaN
    const today = new Date()
    let age = today.getFullYear() - d.getFullYear()
    const m = today.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
    return age
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validazione username semplice
      const trimmedUsername = username.trim()
      if (!/^([a-zA-Z0-9_.-]){3,20}$/.test(trimmedUsername)) {
        throw new Error(
          'Username non valido. Usa 3-20 caratteri alfanumerici, punto, trattino o underscore.'
        )
      }

      // Validazione data di compleanno (opzionale ma, se presente, età minima 13)
      if (birthday) {
        const age = calculateAge(birthday)
        if (Number.isNaN(age)) {
          throw new Error('Data di compleanno non valida.')
        }
        if (age < 13) {
          throw new Error('Devi avere almeno 13 anni per registrarti.')
        }
        const max = new Date().toISOString().split('T')[0]
        if (birthday > max) {
          throw new Error('La data di compleanno non può essere nel futuro.')
        }
      }

      // Registrazione tramite API centralizzata
      const userData: UserInfo = await registerWithEmailPassword({
        email,
        password,
        username: trimmedUsername,
        fullName,
        birthday,
        profilePicFile,
      })
      if (userData) navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0])
    }
  }

  return (
    <Center minH="100vh" bg={containerBg} color={textColor}>
      <Box
        as="form"
        onSubmit={handleRegister}
        bg={containerBg}
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

        {/* Pulsante per cambiare modalità */}
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

        <FormControl mb={4}>
          <FormLabel>Birthday</FormLabel>
          <Input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>Profile Picture</FormLabel>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
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

        <Button
          variant="outline"
          w="100%"
          onMouseEnter={() => import('@pages/Login')}
          onClick={() => navigate('/login')}
        >
          Hai già un account? Fai il Login
        </Button>
      </Box>
    </Center>
  )
}

export default Register
