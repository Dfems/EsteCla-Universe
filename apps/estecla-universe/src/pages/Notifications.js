import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Spinner, Button, Text, VStack } from '@chakra-ui/react';
import { listNotificationsPage, markAllNotificationsRead, } from '@features/notifications/api/notifications';
const NotificationsPage = () => {
    const [items, setItems] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const load = async () => {
        if (loading)
            return;
        setLoading(true);
        const page = await listNotificationsPage(20, cursor || undefined);
        setItems((prev) => [...prev, ...page.items]);
        setCursor(page.cursor);
        setLoading(false);
    };
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsx(Box, { maxW: "640px", mx: "auto", p: 4, children: _jsxs(VStack, { align: "stretch", spacing: 4, children: [_jsx(Heading, { size: "md", children: "Notifiche" }), _jsx(Button, { onClick: () => markAllNotificationsRead(), variant: "outline", alignSelf: "flex-start", children: "Segna tutte come lette" }), _jsx(List, { spacing: 3, children: items.map((n) => (_jsxs(ListItem, { borderWidth: "1px", borderRadius: "md", p: 3, children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: n.createdAt ? n.createdAt.toLocaleString() : '—' }), n.type === 'follow' && (_jsxs(Text, { children: ["Nuovo follower: ", _jsx("b", { children: n.fromUid })] }))] }, n.id))) }), cursor && (_jsx(Button, { onClick: load, isLoading: loading, alignSelf: "center", children: "Carica altri" })), !cursor && loading && _jsx(Spinner, {})] }) }));
};
export default NotificationsPage;
