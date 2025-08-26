import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  return <ChakraButton ref={ref} {...props} />
})
