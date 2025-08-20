// src/theme/index.ts
import { extendTheme } from '@chakra-ui/react'
import { config, colors } from './config'
import fonts from './typography'

const theme = extendTheme({
  config,
  colors,
  fonts,
  components: {
    Tabs: {
      variants: {
        instagram: {
          tablist: {
            borderTop: '1px solid',
            borderColor: 'border',
            display: 'flex',
            justifyContent: 'center',
            gap: { base: 6, md: 12 },
            mb: 2,
          },
          tab: {
            px: 0,
            fontSize: 'xs',
            letterSpacing: 'wider',
            fontWeight: 'bold',
            color: 'gray.500',
            borderTop: '2px solid transparent',
            pt: 3,
            _selected: {
              color: 'tabSelected',
              borderTopColor: 'tabSelected',
              borderTopWidth: '2px',
              borderTopStyle: 'solid',
            },
          },
        },
      },
    },
  },
  // Qui puoi aggiungere eventuali override o global styles in futuro
})

export default theme
