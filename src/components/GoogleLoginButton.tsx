// src/components/GoogleLoginButton.tsx
import { Button } from '@chakra-ui/react'

const GoogleLoginButton = ({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      colorScheme="red"
      w="100%"
      mb={4}
      isLoading={isLoading}
      leftIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          style={{ marginRight: '8px' }}
        >
          <path
            d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.835 0 3.456.705 4.691 1.942l3.099-3.099A10.113 10.113 0 0012.545 2C7.021 2 2.545 6.477 2.545 12s4.476 10 10 10c5.523 0 10-4.477 10-10a10.13 10.13 0 00-.167-1.785"
            fill="#EA4335"
          />
        </svg>
      }
    >
      Continue with Google
    </Button>
  )
}

export default GoogleLoginButton
