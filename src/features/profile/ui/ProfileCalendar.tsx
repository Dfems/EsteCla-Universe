import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Text,
  Tooltip,
  Button,
} from '@chakra-ui/react'
import { Post } from '@models/interfaces'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { useProfileCalendar } from '../../profile/hooks/useProfileCalendar'
import ProfileCalendarModal from './ProfileCalendarModal'

interface ProfileCalendarProps {
  posts: Post[]
}

export default function ProfileCalendar({ posts }: ProfileCalendarProps) {
  const {
    monthLabel,
    weekLabels,
    cells,
    goPrev,
    goNext,
    goToday,
    openFor,
    close,
    selectedKey,
    selectedPosts,
  } = useProfileCalendar(posts)

  return (
    <Box px={1} py={3}>
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold" textTransform="capitalize">
          {monthLabel}
        </Text>
        <Flex gap={2} align="center">
          <Tooltip label="Mese precedente">
            <IconButton
              aria-label="Mese precedente"
              size="sm"
              icon={<BsChevronLeft />}
              onClick={goPrev}
            />
          </Tooltip>
          <Tooltip label="Vai a oggi">
            <Button aria-label="Oggi" size="sm" onClick={goToday}>
              Oggi
            </Button>
          </Tooltip>
          <Tooltip label="Mese successivo">
            <IconButton
              aria-label="Mese successivo"
              size="sm"
              icon={<BsChevronRight />}
              onClick={goNext}
            />
          </Tooltip>
        </Flex>
      </Flex>
      {/* Header giorni settimana, minimal */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={1}>
        {weekLabels.map((w) => (
          <GridItem key={w} textAlign="center" fontSize="xs" color="gray.500">
            {w}
          </GridItem>
        ))}
      </Grid>

      {/* Celle minimal: bordo sottile, numero giorno in alto, thumbnail solo se c'è un post */}
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {cells.map((cell) => (
          <GridItem
            key={cell.key}
            minH="64px"
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            opacity={cell.inMonth ? 1 : 0.35}
            cursor={cell.posts.length ? 'pointer' : 'default'}
            onClick={() => (cell.posts.length ? openFor(cell.key) : undefined)}
          >
            <Box position="relative" h="100%">
              <Text
                position="absolute"
                top={1}
                left={2}
                fontSize="xs"
                fontWeight={cell.isToday ? 'bold' : 'normal'}
              >
                {cell.date.getDate()}
              </Text>
              {cell.posts[0] ? (
                <Image
                  src={cell.posts[0].imageUrl}
                  alt={cell.posts[0].caption}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : null}
            </Box>
          </GridItem>
        ))}
      </Grid>

      <ProfileCalendarModal
        isOpen={!!selectedKey}
        onClose={close}
        dateKey={selectedKey}
        posts={selectedPosts}
      />
    </Box>
  )
}
