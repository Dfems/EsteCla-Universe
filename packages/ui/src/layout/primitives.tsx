import React from 'react'
import { Container, Heading } from '@chakra-ui/react'

export const ContainerSection: React.FC<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Container maxW="container.md" py={4}>
    {title ? (
      <Heading as="h2" size="md" mb={2} textAlign="left">
        {title}
      </Heading>
    ) : null}
    {children}
  </Container>
)
