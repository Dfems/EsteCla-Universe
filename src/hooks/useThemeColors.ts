import { useColorMode } from '@chakra-ui/react'
import { colors } from '@theme'

const useThemeColors = () => {
  const { colorMode } = useColorMode()
  return colors[colorMode === 'dark' ? 'dark' : 'light']
}

export default useThemeColors
