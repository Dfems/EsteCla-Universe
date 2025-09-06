import { Badge } from '@chakra-ui/react'

interface PlaceholderBadgeProps {
  label?: string
}

export const PlaceholderBadge = ({ label = 'Profile' }: PlaceholderBadgeProps) => (
  <Badge colorScheme="purple">{label}</Badge>
)
