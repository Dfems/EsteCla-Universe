import { Heading } from '@chakra-ui/react'
import React from 'react'

interface TitleOnlyProps {
  children?: React.ReactNode
}

export const TitleOnly = ({ children }: TitleOnlyProps) => (
  <Heading size="lg" mb={6} textAlign="left">
    {children}
  </Heading>
)
