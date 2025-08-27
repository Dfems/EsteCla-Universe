import { Badge } from '@chakra-ui/react'

type PlaceholderBadgeProps = { label?: string }

export function PlaceholderBadge({ label = 'Profile' }: PlaceholderBadgeProps) {
  return <Badge colorScheme="purple">{label}</Badge>
}
