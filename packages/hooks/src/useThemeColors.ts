import { useColorModeValue } from '@chakra-ui/react'

// Fornisce colori con fallback basati sul Color Mode, senza dipendere da token custom
const useThemeColors = () => {
  const containerBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const tabSelectedColor = useColorModeValue('blue.500', 'blue.300')
  const tabSelectedBorder = `2px solid ${tabSelectedColor}`
  return { containerBg, borderColor, textColor, tabSelectedColor, tabSelectedBorder }
}

export default useThemeColors
