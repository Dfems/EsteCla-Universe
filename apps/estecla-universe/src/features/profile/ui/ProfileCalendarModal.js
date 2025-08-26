import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, IconButton, Box, Image, Text, } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
export default function ProfileCalendarModal({ isOpen, onClose, dateKey, posts, }) {
    const [index, setIndex] = useState(0);
    const touchStartX = useRef(null);
    useEffect(() => {
        setIndex(0);
    }, [dateKey]);
    const hasPrev = index > 0;
    const hasNext = index < Math.max(0, posts.length - 1);
    const prev = useCallback(() => {
        if (hasPrev)
            setIndex((i) => i - 1);
    }, [hasPrev]);
    const next = useCallback(() => {
        if (hasNext)
            setIndex((i) => i + 1);
    }, [hasNext]);
    const current = posts[index];
    const title = dateKey
        ? new Date(dateKey).toLocaleDateString('it-IT', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
        })
        : '';
    // Scorciatoie tastiera: ←/→ per navigare, Esc per chiudere
    useEffect(() => {
        if (!isOpen)
            return;
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prev();
            }
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                next();
            }
            else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, prev, next, onClose]);
    // Swipe su mobile: rileva tocco sinistra/destra
    const onTouchStart = (e) => {
        if (e.touches.length === 1) {
            touchStartX.current = e.touches[0].clientX;
        }
    };
    const onTouchEnd = (e) => {
        if (touchStartX.current == null)
            return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const threshold = 40; // px
        if (dx > threshold) {
            prev();
        }
        else if (dx < -threshold) {
            next();
        }
        touchStartX.current = null;
    };
    return (_jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "xl", isCentered: true, children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { textTransform: "capitalize", children: title }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { onTouchStart: onTouchStart, onTouchEnd: onTouchEnd, children: current ? (_jsxs(_Fragment, { children: [_jsxs(Flex, { align: "center", gap: 2, mb: 3, justify: "space-between", children: [_jsx(IconButton, { "aria-label": "Precedente", icon: _jsx(BsChevronLeft, {}), onClick: prev, isDisabled: !hasPrev }), _jsx(Box, { flex: 1, children: _jsx(Image, { src: current.imageUrl, alt: current.caption, w: "100%", borderRadius: "md", objectFit: "cover" }) }), _jsx(IconButton, { "aria-label": "Successivo", icon: _jsx(BsChevronRight, {}), onClick: next, isDisabled: !hasNext })] }), current.caption ? (_jsx(Text, { fontSize: "sm", color: "gray.600", whiteSpace: "pre-wrap", children: current.caption })) : null, posts.length > 1 ? (_jsxs(Text, { mt: 2, fontSize: "xs", color: "gray.500", textAlign: "center", children: [index + 1, " / ", posts.length] })) : null] })) : (_jsx(Text, { children: "Nessun contenuto" })) })] })] }));
}
