import { Box, Button, Heading, List, ListItem, Spinner, Text, VStack } from '@chakra-ui/react'
import {
  listNotificationsPage,
  markAllNotificationsRead,
  NotificationItem,
} from '@features/notifications/api/notifications'
import type { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const NotificationsPage = () => {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [cursor, setCursor] = useState<Timestamp | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (loading) return
    setLoading(true)
    const page = await listNotificationsPage(20, cursor || undefined)
    setItems((prev) => [...prev, ...page.items])
    setCursor(page.cursor)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box maxW="640px" mx="auto" p={4}>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Notifiche</Heading>
        <Button onClick={() => markAllNotificationsRead()} variant="outline" alignSelf="flex-start">
          Segna tutte come lette
        </Button>
        <List spacing={3}>
          {items.map((n) => (
            <ListItem key={n.id} borderWidth="1px" borderRadius="md" p={3}>
              <Text fontSize="sm" color="gray.500">
                {n.createdAt ? n.createdAt.toLocaleString() : '—'}
              </Text>
              {n.type === 'follow' && (
                <Text>
                  Nuovo follower: <b>{n.fromUid}</b>
                </Text>
              )}
            </ListItem>
          ))}
        </List>
        {cursor && (
          <Button onClick={load} isLoading={loading} alignSelf="center">
            Carica altri
          </Button>
        )}
        {!cursor && loading && <Spinner />}
      </VStack>
    </Box>
  )
}

export default NotificationsPage
