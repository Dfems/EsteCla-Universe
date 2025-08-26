import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
function App() {
    return _jsx("div", { children: "Glufri Travelers" });
}
// Aggiungo un export per soddisfare react-refresh/only-export-components
export default App;
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
