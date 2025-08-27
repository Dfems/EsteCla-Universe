import { Heading } from '@chakra-ui/react'
import React from 'react'

type TitleOnlyProps = { children?: React.ReactNode }

export function TitleOnly({ children }: TitleOnlyProps) {
  return (
    <Heading size="lg" mb={6} textAlign="left">
      {children}
    </Heading>
  )
}
