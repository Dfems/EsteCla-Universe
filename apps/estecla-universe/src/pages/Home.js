import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Grid, GridItem, Text, Show, VStack } from '@chakra-ui/react';
import useThemeColors from '@hooks/useThemeColors';
import { PostListItem } from '@components/index';
import { useGlobalFeed } from '@hooks/useGlobalFeed';
import { useSuggestedUsers } from '@features/follow/hooks/useSuggestedUsers';
import SuggestedUsers from '@features/follow/ui/SuggestedUsers';
export default function Home() {
    const { containerBg, textColor } = useThemeColors();
    const { items } = useGlobalFeed();
    const { users: suggested } = useSuggestedUsers(6);
    return (_jsx(Box, { p: 4, bg: containerBg, color: textColor, mt: { base: 2, md: 16 }, pb: { base: 24, md: 4 }, children: _jsxs(Container, { maxW: "container.xl", px: { base: 0, md: 4 }, children: [_jsxs(Grid, { templateColumns: { base: '1fr', md: '2fr 1fr' }, gap: { base: 4, md: 8 }, children: [_jsx(GridItem, { children: items.length ? (_jsx(Box, { children: items.map((it) => (_jsx(PostListItem, { user: it.user, post: it.post }, it.id))) })) : (_jsx(Text, { children: "Nessun post disponibile al momento." })) }), _jsx(GridItem, { display: { base: 'none', md: 'block' }, children: _jsx(SuggestedUsers, { users: suggested }) })] }), _jsx(Show, { below: "md", children: _jsx(VStack, { mt: 6, align: "stretch", children: _jsx(SuggestedUsers, { users: suggested, title: "Persone da seguire" }) }) })] }) }));
}
