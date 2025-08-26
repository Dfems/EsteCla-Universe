import { Badge } from '@chakra-ui/react'
import React from 'react'

interface BirthdayBadgeProps {
  secsToBirthday: number | null
}

const BirthdayBadge: React.FC<BirthdayBadgeProps> = ({ secsToBirthday }) => {
  if (secsToBirthday == null || secsToBirthday >= 86_400) return null
  const hours = Math.floor(secsToBirthday / 3600)
  const minutes = Math.floor((secsToBirthday % 3600) / 60)
  const label = hours >= 1 ? `${hours}h` : `${minutes}m`
  return (
    <Badge
      position="absolute"
      top={-1}
      right={-1}
      colorScheme="pink"
      borderRadius="full"
      fontSize="0.6rem"
      px={2}
      py={0.5}
    >
      {label}
    </Badge>
  )
}

export default BirthdayBadge
