import React from 'react'
import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useColorMode,
  Button,
  Icon,
} from '@chakra-ui/react'
import { FaMoon, FaSun } from 'react-icons/fa'
import useThemeColors from '@hooks/useThemeColors'
import ClearCacheButton from '@components/ui/ClearCacheButton'

const SettingsPage: React.FC = () => {
  const { containerBg, textColor, borderColor } = useThemeColors()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box bg={containerBg} color={textColor} minH="100svh" pt={{ base: 4, md: 6 }}>
      <Container maxW="container.md">
        <Heading size="lg" mb={6} textAlign="left">
          Impostazioni
        </Heading>

        <Stack spacing={6} divider={<Box borderTopWidth="1px" borderColor={borderColor} />}>
          <Box>
            <Heading as="h2" size="md" mb={2} textAlign="left">
              Aspetto
            </Heading>
            <HStack justify="space-between">
              <Text>Modalità tema</Text>
              <Button
                onClick={toggleColorMode}
                leftIcon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} />}
                variant="outline"
                aria-label="Toggle dark mode"
              >
                {colorMode === 'light' ? 'Attiva Dark Mode' : 'Disattiva Dark Mode'}
              </Button>
            </HStack>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={2} textAlign="left">
              Cache
            </Heading>
            <HStack justify="space-between">
              <Text>Svuota cache applicazione</Text>
              {/* Riutilizziamo il pulsante esistente */}
              <ClearCacheButton />
            </HStack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default SettingsPage
