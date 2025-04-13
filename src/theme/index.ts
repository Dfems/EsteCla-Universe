// src/theme/index.ts
import { extendTheme } from '@chakra-ui/react'
import config from './config'
import fonts from './typography'

const theme = extendTheme({
  config,
  fonts,
  // Qui puoi aggiungere eventuali override o global styles in futuro
})

export default theme
