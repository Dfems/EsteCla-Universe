import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Flex, Text, Heading, useColorMode } from '@chakra-ui/react';
import useThemeColors from '@hooks/useThemeColors';
import Confetti from 'react-confetti';
const BirthdayCountdown = ({ birthday, fullName, bio }) => {
    // Data di riferimento (solo mese/giorno dalla stringa birthday)
    const targetDate = useMemo(() => new Date(`${birthday}T00:00:00`), [birthday]);
    const { colorMode } = useColorMode();
    const { containerBg, textColor: themeTextColor } = useThemeColors();
    // Funzione per calcolare il tempo residuo fino al prossimo compleanno
    const calculateTimeLeft = useCallback(() => {
        const now = new Date();
        const month = targetDate.getMonth();
        const day = targetDate.getDate();
        const currentYearTarget = new Date(now.getFullYear(), month, day, 0, 0, 0, 0);
        // Se il compleanno di quest'anno è già passato, usa l'anno successivo
        if (currentYearTarget.getTime() <= now.getTime()) {
            currentYearTarget.setFullYear(now.getFullYear() + 1);
        }
        const difference = currentYearTarget.getTime() - now.getTime();
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { days, hours, minutes, seconds };
    }, [targetDate]);
    // Stato per il countdown e per verificare se il compleanno è arrivato
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isBirthday, setIsBirthday] = useState(false);
    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            // Se il tempo residuo è zero, il compleanno è arrivato
            if (newTimeLeft.days <= 0 &&
                newTimeLeft.hours <= 0 &&
                newTimeLeft.minutes <= 0 &&
                newTimeLeft.seconds <= 0) {
                setIsBirthday(true);
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);
    const boxBg = colorMode === 'dark' ? 'pink.700' : 'pink.100';
    const countdownTextColor = colorMode === 'dark' ? 'pink.100' : 'pink.600';
    const headingColor = colorMode === 'dark' ? 'pink.300' : 'pink.600';
    const month = targetDate.getMonth();
    const day = targetDate.getDate();
    const displayDate = new Date(2000, month, day);
    const leadPhrase = useMemo(() => {
        const d = timeLeft.days;
        const h = timeLeft.hours;
        const m = timeLeft.minutes;
        if (d > 30)
            return "C'è ancora tempo fino al";
        if (d > 7)
            return 'Si avvicina il grande giorno, il';
        if (d > 1)
            return 'Manca pochissimo al';
        if (d === 1)
            return 'Domani è il grande giorno:';
        if (h >= 1)
            return `Solo ${h} ${h === 1 ? 'ora' : 'ore'} al`;
        if (m >= 1)
            return `Solo ${m} ${m === 1 ? 'minuto' : 'minuti'} al`;
        return 'Tra pochissimi istanti, il';
    }, [timeLeft.days, timeLeft.hours, timeLeft.minutes]);
    return (_jsxs(Flex, { minH: "100svh", align: "center", justify: { base: 'flex-start', md: 'center' }, bg: "transparent", position: "relative", p: { base: 2, md: 4 }, children: [isBirthday && _jsx(Confetti, { recycle: false, numberOfPieces: 400 }), _jsxs(Box, { bg: containerBg, p: 8, borderRadius: "xl", boxShadow: "2xl", textAlign: "center", mt: { base: 4, md: 0 }, children: [_jsx(Heading, { mb: 6, color: headingColor, fontFamily: "Pacifico", children: isBirthday
                            ? '🎂 BUON COMPLEANNO MOGLIE MIA! 🥳'
                            : `🎉 Compleanno di ${fullName ?? 'una persona speciale'} in arrivo! 🎂` }), !isBirthday ? (_jsxs(Flex, { gap: 4, justify: "center", wrap: "wrap", children: [_jsx(TimeBox, { value: timeLeft.days, label: "Giorni", bg: boxBg, color: countdownTextColor }), _jsx(TimeBox, { value: timeLeft.hours, label: "Ore", bg: boxBg, color: countdownTextColor }), _jsx(TimeBox, { value: timeLeft.minutes, label: "Minuti", bg: boxBg, color: countdownTextColor }), _jsx(TimeBox, { value: timeLeft.seconds, label: "Secondi", bg: boxBg, color: countdownTextColor })] })) : (_jsx(Text, { mt: 2, color: themeTextColor, children: "Tanti auguri di cuore! \uD83C\uDF88" })), _jsxs(Text, { mt: 6, color: themeTextColor, children: [leadPhrase, ' ', displayDate.toLocaleDateString('it-IT', {
                                day: 'numeric',
                                month: 'long',
                            }), "!!!", _jsx("br", {}), bio ?? ''] })] })] }));
};
const TimeBox = ({ value, label, bg, color }) => (_jsxs(Box, { p: 4, minW: "100px", borderRadius: "lg", bg: bg, color: color, boxShadow: "md", transition: "all 0.3s", _hover: { transform: 'translateY(-4px)' }, children: [_jsx(Text, { fontSize: "3xl", fontWeight: "bold", children: value.toString().padStart(2, '0') }), _jsx(Text, { fontSize: "sm", mt: 1, children: label })] }));
export default BirthdayCountdown;
