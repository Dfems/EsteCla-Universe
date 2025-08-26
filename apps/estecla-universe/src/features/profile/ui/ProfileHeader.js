import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Avatar, Flex, Grid, Text, Button, Tooltip, Link as CLink, IconButton, } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useFollow } from '@features/follow/hooks/useFollow';
import { useFollowCounts } from '@features/follow/hooks/useFollowCounts';
import { IoSettingsOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
const ProfileHeader = ({ profileUser, postsCount, isOwnProfile, onEdit, borderColor, onOpenFollowers, onOpenFollowing, }) => {
    const { followers, following } = useFollowCounts(profileUser.uid);
    const navigate = useNavigate();
    return (_jsxs(Grid, { templateColumns: { base: '80px 1fr', md: 'min-content 1fr' }, gap: { base: 8, md: 10 }, alignItems: "center", mb: { base: 6, md: 10 }, children: [_jsx(Avatar, { src: profileUser.profilePic, size: { base: 'xl', md: '2xl' }, name: profileUser.username, showBorder: true, borderWidth: "1px", borderColor: borderColor, alignSelf: "center" }), _jsxs(Box, { w: "full", children: [_jsxs(Flex, { align: { base: 'flex-start', md: 'center' }, gap: 4, mb: 4, wrap: "wrap", children: [_jsx(Text, { fontSize: { base: 'xl', md: '2xl' }, fontWeight: "semibold", noOfLines: 1, children: profileUser.username }), isOwnProfile ? (_jsxs(Flex, { gap: 2, align: "center", children: [_jsx(Tooltip, { label: "Modifica profilo", hasArrow: true, children: _jsx(Button, { size: "sm", variant: "outline", onClick: onEdit, leftIcon: _jsx(EditIcon, {}), children: "Modifica profilo" }) }), _jsx(Tooltip, { label: "Impostazioni", hasArrow: true, children: _jsx(IconButton, { "aria-label": "Impostazioni", icon: _jsx(IoSettingsOutline, {}), size: "sm", variant: "ghost", onClick: () => navigate('/settings') }) })] })) : (_jsx(FollowSection, { targetUid: profileUser.uid }))] }), _jsxs(Flex, { gap: { base: 6, md: 8 }, mb: 4, children: [_jsxs(Text, { children: [_jsx("strong", { children: postsCount }), " post"] }), _jsxs(CLink, { onClick: onOpenFollowers, cursor: "pointer", children: [_jsx("strong", { children: followers ?? profileUser.followers?.length ?? 0 }), " follower"] }), _jsxs(CLink, { onClick: onOpenFollowing, cursor: "pointer", children: [_jsx("strong", { children: following ?? profileUser.following?.length ?? 0 }), " seguiti"] })] }), profileUser.fullName && (_jsx(Text, { fontWeight: "semibold", mb: 1, children: profileUser.fullName })), profileUser.bio && _jsx(Text, { whiteSpace: "pre-wrap", children: profileUser.bio }), profileUser.birthday && (_jsx(Tooltip, { label: "Vedi countdown compleanno", hasArrow: true, children: _jsx(CLink, { onClick: () => navigate('/countdown'), cursor: "pointer", _hover: { textDecoration: 'underline' }, children: _jsxs(Text, { as: "span", fontSize: "sm", color: "gray.500", mt: 2, display: "inline-block", children: ["\uD83C\uDF82", ' ', new Date(profileUser.birthday).toLocaleDateString('it-IT', {
                                        day: 'numeric',
                                        month: 'long',
                                    })] }) }) }))] })] }));
};
export default ProfileHeader;
const FollowSection = ({ targetUid }) => {
    const { isFollowing, follow, unfollow, loading } = useFollow(targetUid);
    return isFollowing ? (_jsx(Button, { size: "sm", variant: "outline", onClick: unfollow, isLoading: loading, children: "Smetti di seguire" })) : (_jsx(Button, { size: "sm", colorScheme: "blue", onClick: follow, isLoading: loading, children: "Segui" }));
};
