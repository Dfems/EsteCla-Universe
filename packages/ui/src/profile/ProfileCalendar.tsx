import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { useProfileCalendar } from '@estecla/hooks'
import type { Post } from '@estecla/types'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import ProfileCalendarModal from './ProfileCalendarModal'

export interface ProfileCalendarProps {
  posts: Post[]
  isLoading?: boolean
}

function CalendarHeader({
  monthLabel,
  goPrev,
  goToday,
  goNext,
}: {
  monthLabel: string
  goPrev: () => void
  goToday: () => void
  goNext: () => void
}) {
  return (
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
  )
}

function CalendarWeekHeader({ weekLabels }: { weekLabels: string[] }) {
  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={1}>
      {weekLabels.map((w, i) => (
        <GridItem key={`${w}-${i}`} textAlign="center" fontSize="xs" color="gray.500">
          {w}
        </GridItem>
      ))}
    </Grid>
  )
}

function CalendarGrid({
  isLoading,
  cells,
  openFor,
}: {
  isLoading?: boolean
  cells: ReturnType<typeof useProfileCalendar>['cells']
  openFor: (key: string) => void
}) {
  if (isLoading) {
    return (
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {Array.from({ length: 42 }).map((_, i) => (
          <GridItem key={i} minH="64px">
            <Skeleton h="64px" borderRadius="md" />
          </GridItem>
        ))}
      </Grid>
    )
  }

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={1}>
      {cells.map((cell: ReturnType<typeof useProfileCalendar>['cells'][number]) => {
        const hasPosts = cell.posts.length > 0
        const preview = hasPosts ? cell.posts[0] : null

        const gridItem = (
          <GridItem
            key={cell.key}
            minH="64px"
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            opacity={cell.inMonth ? 1 : 0.35}
            cursor={hasPosts ? 'pointer' : 'default'}
            onClick={() => (hasPosts ? openFor(cell.key) : undefined)}
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
              {hasPosts ? (
                <Image
                  src={preview!.imageUrl}
                  alt={preview!.caption}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : null}
              {hasPosts ? (
                <Badge
                  position="absolute"
                  bottom={1}
                  right={1}
                  fontSize="0.65em"
                  colorScheme="purple"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                >
                  {cell.posts.length}
                </Badge>
              ) : null}
            </Box>
          </GridItem>
        )

        return hasPosts ? (
          <Tooltip
            key={cell.key}
            hasArrow
            openDelay={200}
            label={
              <Box maxW="140px">
                <Image
                  src={preview!.imageUrl}
                  alt={preview!.caption}
                  w="100%"
                  h="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                {preview!.caption ? (
                  <Text mt={1} fontSize="xs" noOfLines={2}>
                    {preview!.caption}
                  </Text>
                ) : null}
              </Box>
            }
          >
            {gridItem}
          </Tooltip>
        ) : (
          gridItem
        )
      })}
    </Grid>
  )
}

export default function ProfileCalendar({ posts, isLoading }: ProfileCalendarProps) {
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
      <CalendarHeader monthLabel={monthLabel} goPrev={goPrev} goToday={goToday} goNext={goNext} />
      <CalendarWeekHeader weekLabels={weekLabels} />
      <CalendarGrid isLoading={isLoading} cells={cells} openFor={openFor} />
      <ProfileCalendarModal
        isOpen={!!selectedKey}
        onClose={close}
        dateKey={selectedKey}
        posts={selectedPosts}
      />
    </Box>
  )
}
