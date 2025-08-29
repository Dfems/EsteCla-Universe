import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  semanticTokens: {
    colors: {
      containerBg: { default: 'white', _dark: 'gray.800' },
      border: { default: 'gray.200', _dark: 'whiteAlpha.300' },
      text: { default: 'gray.800', _dark: 'gray.100' },
      tabSelected: { default: 'blue.500', _dark: 'blue.300' },
    },
  },
})

export default theme
