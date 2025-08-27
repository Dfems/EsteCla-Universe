import React from 'react'
import { Text } from '@chakra-ui/react'

export const FieldHelp: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Text fontSize="sm" color="gray.500">
    {children}
  </Text>
)
