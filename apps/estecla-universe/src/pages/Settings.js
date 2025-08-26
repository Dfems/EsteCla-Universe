import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Heading, HStack, Stack, Text, useColorMode, Button, Icon, } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import useThemeColors from '@hooks/useThemeColors';
import ClearCacheButton from '@components/ui/ClearCacheButton';
const SettingsPage = () => {
    const { containerBg, textColor, borderColor } = useThemeColors();
    const { colorMode, toggleColorMode } = useColorMode();
    return (_jsx(Box, { bg: containerBg, color: textColor, minH: "100svh", pt: { base: 4, md: 6 }, children: _jsxs(Container, { maxW: "container.md", children: [_jsx(Heading, { size: "lg", mb: 6, textAlign: "left", children: "Impostazioni" }), _jsxs(Stack, { spacing: 6, divider: _jsx(Box, { borderTopWidth: "1px", borderColor: borderColor }), children: [_jsxs(Box, { children: [_jsx(Heading, { as: "h2", size: "md", mb: 2, textAlign: "left", children: "Aspetto" }), _jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { children: "Modalit\u00E0 tema" }), _jsx(Button, { onClick: toggleColorMode, leftIcon: _jsx(Icon, { as: colorMode === 'light' ? FaMoon : FaSun }), variant: "outline", "aria-label": "Toggle dark mode", children: colorMode === 'light' ? 'Attiva Dark Mode' : 'Disattiva Dark Mode' })] })] }), _jsxs(Box, { children: [_jsx(Heading, { as: "h2", size: "md", mb: 2, textAlign: "left", children: "Cache" }), _jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { children: "Svuota cache applicazione" }), _jsx(ClearCacheButton, {})] })] })] })] }) }));
};
export default SettingsPage;
