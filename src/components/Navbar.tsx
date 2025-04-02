import { Flex, IconButton, Spacer, useBreakpointValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons'

export default function Navbar() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Flex p={4} bg="gray.800" color="white" alignItems="center">
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
        EsteCla
      </Link>

      <Spacer />

      {!isMobile ? (
        <Flex gap={4}>
          <Link to="/search">
            <IconButton aria-label="Search users" icon={<SearchIcon />} variant="ghost" />
          </Link>
        </Flex>
      ) : (
        <IconButton aria-label="Menu" icon={<HamburgerIcon />} variant="outline" />
      )}
    </Flex>
  )
}
