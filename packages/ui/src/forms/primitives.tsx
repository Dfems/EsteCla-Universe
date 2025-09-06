import { Text } from '@chakra-ui/react'
import React from 'react'

interface FieldHelpProps {
  children?: React.ReactNode
}

export const FieldHelp = ({ children }: FieldHelpProps) => (
  <Text fontSize="sm" color="gray.500">
    {children}
  </Text>
)
