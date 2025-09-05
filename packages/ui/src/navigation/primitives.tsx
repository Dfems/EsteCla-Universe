import { Box } from '@chakra-ui/react'

interface NavbarSpacerProps {
  h?: number | string
}

export function NavbarSpacer({ h = 12 }: NavbarSpacerProps) {
  return <Box as="div" h={h} />
}
