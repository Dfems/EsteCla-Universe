import React from 'react'
import { Heading } from '@chakra-ui/react'

export const TitleOnly: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Heading size="lg" mb={6} textAlign="left">
    {children}
  </Heading>
)
