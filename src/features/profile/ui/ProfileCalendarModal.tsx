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
import { Post } from '@models/interfaces'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setIndex(0)
  }, [dateKey])

  const hasPrev = index > 0
  const hasNext = index < Math.max(0, posts.length - 1)

  const prev = () => hasPrev && setIndex((i) => i - 1)
  const next = () => hasNext && setIndex((i) => i + 1)

  const current = posts[index]
  const title = dateKey
    ? new Date(dateKey).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      })
    : ''

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform="capitalize">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
