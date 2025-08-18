// src/theme/config.ts
import { ThemeConfig, extendTheme } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const colors = {
  light: {
    containerBg: 'white',
    borderColor: 'gray.200',
    textColor: 'gray.800',
    tabSelectedColor: 'black',
    tabSelectedBorder: '2px solid black',
  },
  dark: {
    containerBg: 'gray.800',
    borderColor: 'gray.600',
    textColor: 'whiteAlpha.900',
    tabSelectedColor: 'white',
    tabSelectedBorder: '2px solid white',
  },
}

const theme = extendTheme({
  config,
  colors,
})

export { config, theme, colors }
