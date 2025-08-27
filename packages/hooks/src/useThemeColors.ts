import { useToken } from '@chakra-ui/react'

const useThemeColors = () => {
  const [containerBg, borderColor, textColor, tabSelectedColor] = useToken('colors', [
    'containerBg',
    'border',
    'text',
    'tabSelected',
  ])
  const tabSelectedBorder = `2px solid ${tabSelectedColor}`
  return { containerBg, borderColor, textColor, tabSelectedColor, tabSelectedBorder }
}

export default useThemeColors
