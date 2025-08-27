import { Box } from '@chakra-ui/react'

type NavbarSpacerProps = { h?: number | string }

export function NavbarSpacer({ h = 12 }: NavbarSpacerProps) {
  return <Box as="div" h={h} />
}
