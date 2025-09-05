import { Badge } from '@chakra-ui/react'

interface PlaceholderBadgeProps {
  label?: string
}

export function PlaceholderBadge({ label = 'Profile' }: PlaceholderBadgeProps) {
  return <Badge colorScheme="purple">{label}</Badge>
}
