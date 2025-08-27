import React from 'react'
import { Badge } from '@chakra-ui/react'

export const PlaceholderBadge: React.FC<{ label?: string }> = ({ label = 'Profile' }) => (
  <Badge colorScheme="purple">{label}</Badge>
)
