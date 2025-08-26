import { jsx as _jsx } from "react/jsx-runtime";
// src/components/ui/LoadingSpinner.tsx
import { Spinner } from '@chakra-ui/react';
export default function LoadingSpinner() {
    return (_jsx("div", { style: { display: 'grid', placeItems: 'center', height: '100vh' }, children: _jsx(Spinner, { size: "xl" }) }));
}
