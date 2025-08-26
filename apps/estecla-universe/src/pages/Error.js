import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
export default function ErrorPage() {
    const navigate = useNavigate();
    const error = useRouteError();
    const isResponse = isRouteErrorResponse(error);
    const status = isResponse ? error.status : undefined;
    const statusText = isResponse ? error.statusText : undefined;
    const message = !isResponse && error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : undefined;
    const title = status === 404 ? '404 - Pagina non trovata' : 'Qualcosa è andato storto';
    const detail = statusText || message || 'Riprova tra poco oppure torna alla Home.';
    return (_jsx(Box, { minH: "100svh", display: "flex", alignItems: "center", justifyContent: "center", p: 6, children: _jsxs(VStack, { spacing: 4, textAlign: "center", children: [_jsx(Heading, { size: "lg", children: title }), _jsx(Text, { color: "gray.500", children: detail }), _jsxs(Box, { display: "flex", gap: 3, children: [_jsx(Button, { colorScheme: "blue", onClick: () => navigate('/'), children: "Torna alla Home" }), _jsx(Button, { variant: "outline", onClick: () => window.location.reload(), children: "Riprova" })] })] }) }));
}
