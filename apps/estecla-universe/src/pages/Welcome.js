import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Button, Container, Heading, HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@context/AuthContext';
import useThemeColors from '@hooks/useThemeColors';
import { useNavigate } from 'react-router-dom';
import { useWelcomeGate } from '@hooks/useWelcomeGate';
const MotionBox = motion(Box);
export default function Welcome() {
    const { user } = useAuth();
    const { containerBg, textColor } = useThemeColors();
    const navigate = useNavigate();
    const { setLastSeenNow, shouldShowWelcome, setSnoozeUntilEndOfDay } = useWelcomeGate();
    const envAutoMs = Number(import.meta.env.VITE_WELCOME_AUTO_CONTINUE_MS);
    const AUTO_CONTINUE_MS = Number.isFinite(envAutoMs) && envAutoMs > 0 ? envAutoMs : 4000;
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 5)
            return 'Buona notte';
        if (hour < 12)
            return 'Buongiorno';
        if (hour < 18)
            return 'Buon pomeriggio';
        return 'Buonasera';
    }, []);
    useEffect(() => {
        // If welcome is not needed (e.g., direct nav), skip instantly
        if (!shouldShowWelcome()) {
            navigate('/', { replace: true });
            return;
        }
        const t = setTimeout(() => handleContinue(), AUTO_CONTINUE_MS);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleContinue = () => {
        setLastSeenNow();
        navigate('/', { replace: true });
    };
    const handleSnoozeToday = () => {
        setSnoozeUntilEndOfDay();
        setLastSeenNow();
        navigate('/', { replace: true });
    };
    return (_jsx(Box, { minH: "calc(100dvh)", bg: containerBg, color: textColor, display: "flex", alignItems: "center", children: _jsx(Container, { maxW: "container.md", textAlign: "center", children: _jsxs(MotionBox, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs(Heading, { size: "lg", mb: 2, children: [greeting, user?.fullName ? `, ${user.fullName}` : user?.username ? `, ${user.username}` : '', "!"] }), _jsxs(Text, { fontSize: "md", opacity: 0.85, mb: 6, children: ["Bentornat", user?.fullName || user?.username ? 'ə' : 'o/a', " su EsteCla Universe."] }), _jsxs(HStack, { spacing: 3, justify: "center", children: [_jsx(Button, { colorScheme: "teal", onClick: handleContinue, children: "Entra" }), _jsx(Button, { variant: "ghost", onClick: handleSnoozeToday, children: "Non mostrare pi\u00F9 oggi" })] })] }) }) }));
}
