import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  // Base palette similar to main branch
  colors: {
    light: {
      containerBg: '#ffffff',
      borderColor: '#e2e8f0',
      textColor: '#1a202c',
      tabSelectedColor: '#3182ce',
    },
    dark: {
      containerBg: '#1a202c',
      borderColor: 'rgba(255,255,255,0.24)',
      textColor: '#f7fafc',
      tabSelectedColor: '#63b3ed',
    },
  },
  semanticTokens: {
    colors: {
      containerBg: { default: '{colors.light.containerBg}', _dark: '{colors.dark.containerBg}' },
      border: { default: '{colors.light.borderColor}', _dark: '{colors.dark.borderColor}' },
      text: { default: '{colors.light.textColor}', _dark: '{colors.dark.textColor}' },
      tabSelected: {
        default: '{colors.light.tabSelectedColor}',
        _dark: '{colors.dark.tabSelectedColor}',
      },
    },
  },
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
})

export default theme
