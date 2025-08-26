import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return <div>Glufri Travelers</div>
}

// Aggiungo un export per soddisfare react-refresh/only-export-components
export default App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
