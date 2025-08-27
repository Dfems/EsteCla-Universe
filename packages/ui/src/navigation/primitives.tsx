import React from 'react'
import { Box } from '@chakra-ui/react'

export const NavbarSpacer: React.FC<{ h?: number | string }> = ({ h = 12 }) => (
  <Box as="div" h={h} />
)
