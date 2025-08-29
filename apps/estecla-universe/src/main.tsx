import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { AuthProvider } from '@estecla/firebase-react'
import theme from '@estecla/theme'
import { router } from '@routes'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// Inizializza Firebase prima che AuthProvider chiami getServices()
import '@services/firebase'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <Suspense fallback={<div style={{ padding: 24 }}>Caricamento…</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
)
