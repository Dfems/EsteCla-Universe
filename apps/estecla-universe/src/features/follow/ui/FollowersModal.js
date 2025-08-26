import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, HStack, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, ModalCloseButton, } from '@chakra-ui/react';
import { getUsersByUids, listFollowersPage, listFollowingPage } from '@features/follow/api/follow';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
const FollowersModal = ({ uid, type, isOpen, onClose }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(false);
    useEffect(() => {
        if (!isOpen)
            return;
        (async () => {
            setLoading(true);
            setItems([]);
            setCursor(null);
            setHasMore(true);
            try {
                const page = type === 'followers' ? await listFollowersPage(uid, 30) : await listFollowingPage(uid, 30);
                const ids = page.docs.map((d) => d.id);
                const users = await getUsersByUids(ids);
                setItems(users);
                setCursor(page.nextCursor || null);
                setHasMore(Boolean(page.nextCursor));
            }
            finally {
                setLoading(false);
            }
        })();
    }, [isOpen, type, uid]);
    const loadMore = useCallback(async () => {
        if (!hasMore || loadingRef.current)
            return;
        loadingRef.current = true;
        try {
            const page = type === 'followers'
                ? await listFollowersPage(uid, 30, cursor || undefined)
                : await listFollowingPage(uid, 30, cursor || undefined);
            const ids = page.docs.map((d) => d.id);
            const users = await getUsersByUids(ids);
            setItems((prev) => [...prev, ...users]);
            setCursor(page.nextCursor || null);
            setHasMore(Boolean(page.nextCursor));
        }
        finally {
            loadingRef.current = false;
        }
    }, [cursor, hasMore, type, uid]);
    const onScroll = useCallback((props) => {
        const { scrollDirection, scrollOffset, scrollUpdateWasRequested } = props;
        if (scrollUpdateWasRequested || scrollDirection !== 'forward')
            return;
        // Se siamo a 200px dalla fine, carica altre
        const estimatedTotal = items.length * 64;
        if (estimatedTotal - scrollOffset < 200)
            void loadMore();
    }, [items.length, loadMore]);
    return (_jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "sm", motionPreset: "slideInBottom", children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: type === 'followers' ? 'Follower' : 'Seguiti' }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: loading ? (_jsx(Text, { children: "Caricamento\u2026" })) : items.length ? (_jsxs(Box, { height: "60vh", children: [_jsx(List, { height: Math.min(480, Math.max(240, Math.min(window.innerHeight * 0.6, 600))), width: "100%", itemCount: items.length, itemSize: 64, onScroll: onScroll, children: ({ index, style }) => {
                                        const u = items[index];
                                        return (_jsxs(HStack, { justify: "space-between", style: style, px: 1, children: [_jsxs(HStack, { as: Link, to: `/profile/${u.username}`, gap: 3, minW: 0, children: [_jsx(Avatar, { size: "sm", src: u.profilePic, name: u.username }), _jsxs(Box, { minW: 0, children: [_jsx(Text, { fontWeight: "medium", noOfLines: 1, children: u.username }), u.fullName && (_jsx(Text, { fontSize: "xs", color: "gray.500", noOfLines: 1, children: u.fullName }))] })] }), _jsx(Button, { size: "xs", as: Link, to: `/profile/${u.username}`, children: "Vedi" })] }, u.uid));
                                    } }), hasMore && (_jsx(Box, { textAlign: "center", py: 2, children: _jsx(Button, { size: "sm", onClick: () => void loadMore(), children: "Carica altro" }) }))] })) : (_jsx(Box, { py: 4, textAlign: "center", children: _jsx(Text, { color: "gray.500", children: "Nessun elemento" }) })) })] })] }));
};
export default FollowersModal;
