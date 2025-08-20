import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@routes'
import { AuthProvider } from '@context/AuthProvider'
import theme from '@theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
)
