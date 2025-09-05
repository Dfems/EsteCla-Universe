import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()
  const error = useRouteError()

  const isResponse = isRouteErrorResponse(error)
  const status = isResponse ? error.status : undefined
  const statusText = isResponse ? error.statusText : undefined

  const message =
    !isResponse && error && typeof error === 'object' && 'message' in error
      ? String((error as { message?: unknown }).message)
      : undefined

  const title = status === 404 ? '404 - Pagina non trovata' : 'Qualcosa è andato storto'
  const detail = statusText || message || 'Riprova tra poco oppure torna alla Home.'

  return (
    <Box minH="100svh" display="flex" alignItems="center" justifyContent="center" p={6}>
      <VStack spacing={4} textAlign="center">
        <Heading size="lg">{title}</Heading>
        <Text color="gray.500">{detail}</Text>
        <Box display="flex" gap={3}>
          <Button colorScheme="blue" onClick={() => navigate('/')}>
            Torna alla Home
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Riprova
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}
