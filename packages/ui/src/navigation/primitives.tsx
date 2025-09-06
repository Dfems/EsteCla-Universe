import { Box } from '@chakra-ui/react'

interface NavbarSpacerProps {
  h?: number | string
}

export const NavbarSpacer = ({ h = 12 }: NavbarSpacerProps) => <Box as="div" h={h} />
