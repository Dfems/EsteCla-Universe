import { Box, Container, Text } from '@chakra-ui/react'
import { useAuth } from '@context/AuthContext'
import useThemeColors from '@hooks/useThemeColors'
import { PostListItem } from '@components/index'
import { useGlobalFeed } from '@hooks/useGlobalFeed'

export default function Home() {
  const { user } = useAuth()
  const { containerBg, textColor } = useThemeColors()
  const { items } = useGlobalFeed()

  return (
    <Box p={4} bg={containerBg} color={textColor} mt={{ base: 6, md: 6 }}>
      <Container maxW="container.md" px={{ base: 0, md: 4 }}>
        <Text mb={4}>Benvenuto/a {user?.fullName || user?.username || 'Guest'}!</Text>
        {items.length ? (
          <Box>
            {items.map((it) => (
              <PostListItem key={it.id} user={it.user} post={it.post} />
            ))}
          </Box>
        ) : (
          <Text>Nessun post disponibile al momento.</Text>
        )}
      </Container>
    </Box>
  )
}
