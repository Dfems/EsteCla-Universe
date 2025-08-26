import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Flex, HStack, Image, Text } from '@chakra-ui/react';
function formatDate(d) {
    if (!d)
        return '';
    try {
        return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    catch {
        return '';
    }
}
const PostListItem = ({ user, post }) => {
    const navigate = useNavigate();
    const goProfile = () => navigate(`/profile/${user.username}`);
    return (_jsxs(Box, { borderWidth: "1px", borderRadius: "md", overflow: "hidden", mb: 4, bg: "chakra-body-bg", children: [_jsxs(HStack, { spacing: 3, px: 3, py: 2, children: [_jsx(Avatar, { size: "sm", src: user.profilePic, name: user.username, cursor: "pointer", onClick: goProfile }), _jsxs(Flex, { direction: "column", minW: 0, flex: 1, children: [_jsx(Text, { fontWeight: "semibold", noOfLines: 1, cursor: "pointer", onClick: goProfile, children: user.username }), _jsx(Text, { fontSize: "sm", color: "gray.500", children: formatDate(post.publishAt || post.createdAt || post.timestamp) })] })] }), _jsx(Box, { cursor: "pointer", onClick: goProfile, children: _jsx(Image, { src: post.imageUrl, alt: post.caption, w: "100%", objectFit: "cover" }) }), post.caption ? (_jsx(Box, { px: 3, py: 2, children: _jsx(Text, { whiteSpace: "pre-wrap", children: post.caption }) })) : null] }));
};
export default PostListItem;
