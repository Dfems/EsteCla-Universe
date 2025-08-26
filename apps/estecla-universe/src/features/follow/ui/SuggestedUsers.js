import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Box, Button, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import useThemeColors from '@hooks/useThemeColors';
import { useFollow } from '@features/follow/hooks/useFollow';
import { Link } from 'react-router-dom';
const SuggestedUsers = ({ users, title = 'Suggeriti per te', max = 8, }) => {
    const { containerBg, borderColor, textColor } = useThemeColors();
    const sliced = users?.slice(0, max) || [];
    if (!sliced.length)
        return null;
    return (_jsxs(Box, { bg: containerBg, borderWidth: "1px", borderColor: borderColor, borderRadius: "md", p: 3, w: "full", children: [_jsx(Heading, { as: "h3", size: "sm", mb: 2, color: textColor, children: title }), _jsx(VStack, { spacing: 2, align: "stretch", children: sliced.map((u) => (_jsx(UserRow, { user: u }, u.uid))) })] }));
};
const UserRow = ({ user }) => {
    const { isFollowing, follow, loading } = useFollow(user.uid);
    if (isFollowing)
        return null;
    return (_jsxs(HStack, { justify: "space-between", children: [_jsxs(HStack, { as: Link, to: `/profile/${user.username}`, gap: 3, minW: 0, children: [_jsx(Avatar, { size: "sm", src: user.profilePic, name: user.username }), _jsxs(Stack, { spacing: 0, minW: 0, children: [_jsx(Text, { fontWeight: "semibold", noOfLines: 1, children: user.username }), user.fullName && (_jsx(Text, { fontSize: "xs", color: "gray.500", noOfLines: 1, children: user.fullName }))] })] }), _jsx(Button, { size: "xs", onClick: follow, isLoading: loading, variant: "solid", colorScheme: "blue", children: "Segui" })] }));
};
export default SuggestedUsers;
