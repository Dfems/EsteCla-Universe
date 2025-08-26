import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  ModalCloseButton,
} from '@chakra-ui/react'
import { getUsersByUids, listFollowersPage, listFollowingPage } from '@features/follow/api/follow'
import type { UserInfo } from '@models/interfaces'
import { Link } from 'react-router-dom'
import { FixedSizeList as List, ListOnScrollProps, ListChildComponentProps } from 'react-window'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'

interface FollowersModalProps {
  uid: string
  type: 'followers' | 'following'
  isOpen: boolean
  onClose: () => void
}

const FollowersModal: React.FC<FollowersModalProps> = ({ uid, type, isOpen, onClose }) => {
  const [items, setItems] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(
    null
  )
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      setLoading(true)
      setItems([])
      setCursor(null)
      setHasMore(true)
      try {
        const page =
          type === 'followers' ? await listFollowersPage(uid, 30) : await listFollowingPage(uid, 30)
        const ids = page.docs.map((d) => d.id)
        const users = await getUsersByUids(ids)
        setItems(users)
        setCursor(page.nextCursor || null)
        setHasMore(Boolean(page.nextCursor))
      } finally {
        setLoading(false)
      }
    })()
  }, [isOpen, type, uid])

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current) return
    loadingRef.current = true
    try {
      const page =
        type === 'followers'
          ? await listFollowersPage(uid, 30, cursor || undefined)
          : await listFollowingPage(uid, 30, cursor || undefined)
      const ids = page.docs.map((d) => d.id)
      const users = await getUsersByUids(ids)
      setItems((prev) => [...prev, ...users])
      setCursor(page.nextCursor || null)
      setHasMore(Boolean(page.nextCursor))
    } finally {
      loadingRef.current = false
    }
  }, [cursor, hasMore, type, uid])

  const onScroll = useCallback(
    (props: ListOnScrollProps) => {
      const { scrollDirection, scrollOffset, scrollUpdateWasRequested } = props
      if (scrollUpdateWasRequested || scrollDirection !== 'forward') return
      // Se siamo a 200px dalla fine, carica altre
      const estimatedTotal = items.length * 64
      if (estimatedTotal - scrollOffset < 200) void loadMore()
    },
    [items.length, loadMore]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{type === 'followers' ? 'Follower' : 'Seguiti'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Text>Caricamento…</Text>
          ) : items.length ? (
            <Box height="60vh">
              <List
                height={Math.min(480, Math.max(240, Math.min(window.innerHeight * 0.6, 600)))}
                width="100%"
                itemCount={items.length}
                itemSize={64}
                onScroll={onScroll}
              >
                {({ index, style }: ListChildComponentProps) => {
                  const u = items[index]
                  return (
                    <HStack key={u.uid} justify="space-between" style={style} px={1}>
                      <HStack as={Link} to={`/profile/${u.username}`} gap={3} minW={0}>
                        <Avatar size="sm" src={u.profilePic} name={u.username} />
                        <Box minW={0}>
                          <Text fontWeight="medium" noOfLines={1}>
                            {u.username}
                          </Text>
                          {u.fullName && (
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {u.fullName}
                            </Text>
                          )}
                        </Box>
                      </HStack>
                      <Button size="xs" as={Link} to={`/profile/${u.username}`}>
                        Vedi
                      </Button>
                    </HStack>
                  )
                }}
              </List>
              {hasMore && (
                <Box textAlign="center" py={2}>
                  <Button size="sm" onClick={() => void loadMore()}>
                    Carica altro
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box py={4} textAlign="center">
              <Text color="gray.500">Nessun elemento</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default FollowersModal
