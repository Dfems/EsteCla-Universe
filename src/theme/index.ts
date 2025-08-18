// src/theme/index.ts
import { extendTheme } from '@chakra-ui/react'
import { config, colors } from './config'
import fonts from './typography'

const theme = extendTheme({
  config,
  colors,
  fonts,
  // Qui puoi aggiungere eventuali override o global styles in futuro
})

export default theme
