import { Container, Heading } from '@chakra-ui/react'
import React from 'react'

interface ContainerSectionProps {
  title?: string
  children?: React.ReactNode
}

export const ContainerSection = ({ title, children }: ContainerSectionProps) => (
  <Container maxW="container.md" py={4}>
    {title ? (
      <Heading as="h2" size="md" mb={2} textAlign="left">
        {title}
      </Heading>
    ) : null}
    {children}
  </Container>
)
