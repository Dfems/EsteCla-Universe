import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from '@estecla/firebase-react'

function App() {
  const { user, loading } = useAuth()
  return <div>Glufri Travelers {loading ? '(loading...)' : user ? `- ${user.username}` : ''}</div>
}

// Aggiungo un export per soddisfare react-refresh/only-export-components
export default App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
