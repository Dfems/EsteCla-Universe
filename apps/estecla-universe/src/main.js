import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes';
import { AuthProvider } from '@context/AuthProvider';
import theme from '@theme';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsxs(ChakraProvider, { theme: theme, children: [_jsx(ColorModeScript, { initialColorMode: theme.config.initialColorMode }), _jsx(AuthProvider, { children: _jsx(Suspense, { fallback: _jsx("div", { style: { padding: 24 }, children: "Caricamento\u2026" }), children: _jsx(RouterProvider, { router: router }) }) })] }) }));
