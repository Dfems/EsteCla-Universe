import { Box, Container, Text } from '@chakra-ui/react'
import useThemeColors from '@hooks/useThemeColors'
import { PostListItem } from '@components/index'
import { useGlobalFeed } from '@hooks/useGlobalFeed'

export default function Home() {
  const { containerBg, textColor } = useThemeColors()
  const { items } = useGlobalFeed()

  return (
    <Box p={4} bg={containerBg} color={textColor} mt={{ base: 6, md: 6 }}>
      <Container maxW="container.md" px={{ base: 0, md: 4 }}>
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
