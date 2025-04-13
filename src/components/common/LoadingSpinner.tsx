// src/components/LoadingSpinner.tsx
import { Spinner } from '@chakra-ui/react'

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <Spinner size="xl" />
    </div>
  )
}
