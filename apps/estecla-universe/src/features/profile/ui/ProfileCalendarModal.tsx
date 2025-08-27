import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  IconButton,
  Box,
  Image,
  Text,
} from '@chakra-ui/react'
import { Post } from '@estecla/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

interface ProfileCalendarModalProps {
  isOpen: boolean
  onClose: () => void
  dateKey: string | null
  posts: Post[]
}

export default function ProfileCalendarModal({
  isOpen,
  onClose,
  dateKey,
  posts,
}: ProfileCalendarModalProps) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    setIndex(0)
  }, [dateKey])

  const hasPrev = index > 0
  const hasNext = index < Math.max(0, posts.length - 1)

  const prev = useCallback(() => {
    if (hasPrev) setIndex((i) => i - 1)
  }, [hasPrev])
  const next = useCallback(() => {
    if (hasNext) setIndex((i) => i + 1)
  }, [hasNext])

  const current = posts[index]
  const title = dateKey
    ? new Date(dateKey).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      })
    : ''

  // Scorciatoie tastiera: ←/→ per navigare, Esc per chiudere
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, prev, next, onClose])

  // Swipe su mobile: rileva tocco sinistra/destra
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX
    }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const threshold = 40 // px
    if (dx > threshold) {
      prev()
    } else if (dx < -threshold) {
      next()
    }
    touchStartX.current = null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform="capitalize">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {current ? (
            <>
              <Flex align="center" gap={2} mb={3} justify="space-between">
                <IconButton
                  aria-label="Precedente"
                  icon={<BsChevronLeft />}
                  onClick={prev}
                  isDisabled={!hasPrev}
                />
                <Box flex={1}>
                  <Image
                    src={current.imageUrl}
                    alt={current.caption}
                    w="100%"
                    borderRadius="md"
                    objectFit="cover"
                  />
                </Box>
                <IconButton
                  aria-label="Successivo"
                  icon={<BsChevronRight />}
                  onClick={next}
                  isDisabled={!hasNext}
                />
              </Flex>
              {current.caption ? (
                <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">
                  {current.caption}
                </Text>
              ) : null}
              {posts.length > 1 ? (
                <Text mt={2} fontSize="xs" color="gray.500" textAlign="center">
                  {index + 1} / {posts.length}
                </Text>
              ) : null}
            </>
          ) : (
            <Text>Nessun contenuto</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
