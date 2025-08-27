import { Text } from '@chakra-ui/react'
import React from 'react'

type FieldHelpProps = { children?: React.ReactNode }

export function FieldHelp({ children }: FieldHelpProps) {
  return (
    <Text fontSize="sm" color="gray.500">
      {children}
    </Text>
  )
}
