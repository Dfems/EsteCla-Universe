import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Image, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
export default function PostCard({ post, username }) {
    const navigate = useNavigate();
    const handleClick = username ? () => navigate(`/profile/${username}`) : undefined;
    const clickable = Boolean(handleClick);
    return (_jsx(Box, { position: "relative", cursor: clickable ? 'pointer' : 'default', role: "group", onClick: handleClick, tabIndex: clickable ? 0 : undefined, onKeyDown: clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick?.();
                }
            }
            : undefined, "aria-label": clickable ? `Apri profilo di ${username}` : undefined, children: _jsxs(Box, { position: "relative", w: "100%", pt: "100%", overflow: "hidden", children: [_jsx(Image, { src: post.imageUrl, alt: post.caption, objectFit: "cover", w: "100%", h: "100%", position: "absolute", top: 0, left: 0 }), _jsx(Flex, { position: "absolute", inset: 0, bg: "blackAlpha.500", opacity: 0, _groupHover: { opacity: 1 }, transition: "opacity 0.2s ease", align: "center", justify: "center", children: _jsx(Text, { fontSize: "sm", color: "white", px: 2, noOfLines: 1, children: post.caption }) })] }) }));
}
