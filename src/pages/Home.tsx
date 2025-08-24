import { Box, Container, Grid, GridItem, Text, Show, VStack } from '@chakra-ui/react'
import useThemeColors from '@hooks/useThemeColors'
import { PostListItem } from '@components/index'
import { useGlobalFeed } from '@hooks/useGlobalFeed'
import { useSuggestedUsers } from '@features/follow/hooks/useSuggestedUsers'
import SuggestedUsers from '@features/follow/ui/SuggestedUsers'

export default function Home() {
  const { containerBg, textColor } = useThemeColors()
  const { items } = useGlobalFeed()
  const { users: suggested } = useSuggestedUsers(6)

  return (
    <Box p={4} bg={containerBg} color={textColor} mt={{ base: 6, md: 6 }}>
      <Container maxW="container.xl" px={{ base: 0, md: 4 }}>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={{ base: 4, md: 8 }}>
          <GridItem>
            {items.length ? (
              <Box>
                {items.map((it) => (
                  <PostListItem key={it.id} user={it.user} post={it.post} />
                ))}
              </Box>
            ) : (
              <Text>Nessun post disponibile al momento.</Text>
            )}
          </GridItem>
          <GridItem display={{ base: 'none', md: 'block' }}>
            <SuggestedUsers users={suggested} />
          </GridItem>
        </Grid>

        <Show below="md">
          <VStack mt={6} align="stretch">
            <SuggestedUsers users={suggested} title="Persone da seguire" />
          </VStack>
        </Show>
      </Container>
    </Box>
  )
}
