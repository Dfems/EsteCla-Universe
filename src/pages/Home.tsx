import { Box, Text, SimpleGrid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAuth } from '@context/AuthContext'
import useThemeColors from '@hooks/useThemeColors'
import { PostCard } from '@components/index'
import { collection, onSnapshot, orderBy, query, type Timestamp } from 'firebase/firestore'
import { db } from '@services/firebase'

export default function Home() {
  const { user } = useAuth()
  const { containerBg, textColor } = useThemeColors()
  type UserPost = { id: string; imageUrl: string; caption: string; createdAt?: Timestamp | null }
  const [posts, setPosts] = useState<UserPost[]>([])

  useEffect(() => {
    if (!user?.uid) return
    const q = query(collection(db, 'users', user.uid, 'posts'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const items: UserPost[] = snap.docs.map((d) => {
        const data = d.data() as { imageUrl: string; caption: string; createdAt?: Timestamp | null }
        return {
          id: d.id,
          imageUrl: data.imageUrl,
          caption: data.caption,
          createdAt: data.createdAt,
        }
      })
      setPosts(items)
    })
    return () => unsub()
  }, [user?.uid])

  return (
    <Box p={4} bg={containerBg} color={textColor} mt={{ base: 6, md: 6 }}>
      <Text mb={4}>Benvenuto/a {user?.fullName || user?.username || 'Guest'}!</Text>
      {user ? (
        posts.length ? (
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
            {posts.map((p) => (
              <PostCard key={p.id} post={{ id: p.id, imageUrl: p.imageUrl, caption: p.caption }} />
            ))}
          </SimpleGrid>
        ) : (
          <Text>Nessun post ancora. Carica una foto dalla barra!</Text>
        )
      ) : (
        <Text>Accedi per vedere e pubblicare i tuoi post.</Text>
      )}
    </Box>
  )
}
