import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/features/profile/ui/ProfileDetails.tsx
import { useMemo } from 'react';
import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, HStack, IconButton, } from '@chakra-ui/react';
import { BsGrid3X3, BsBookmark, BsCalendarEvent } from 'react-icons/bs';
import { FaList } from 'react-icons/fa';
import { MdOutlineRestaurant } from 'react-icons/md';
import ProfileHeader from './ProfileHeader';
import ProfilePostGrid from './ProfilePostGrid';
import ProfilePostList from './ProfilePostList';
import ProfileCalendar from './ProfileCalendar';
import useThemeColors from '@hooks/useThemeColors';
import { useProfileViewMode } from '@features/profile/hooks/useProfileViewMode';
const ProfileDetails = ({ profileUser, posts, isOwnProfile, onEdit, loadingPosts, onOpenFollowers, onOpenFollowing, }) => {
    const { containerBg, borderColor, textColor } = useThemeColors();
    const { viewMode, setGrid, setList } = useProfileViewMode('grid');
    const postsSorted = useMemo(() => {
        // Ordina per publishAt/createdAt/timestamp disc
        const key = (p) => (p.publishAt || p.createdAt || p.timestamp || new Date(0)).getTime();
        return [...posts].sort((a, b) => key(b) - key(a));
    }, [posts]);
    return (_jsxs(Box, { maxW: "935px", mx: "auto", px: { base: 4, md: 6 }, py: 4, minH: "100vh", bg: containerBg, color: textColor, mt: { base: 6, md: 6 }, children: [_jsx(ProfileHeader, { profileUser: profileUser, postsCount: posts.length, isOwnProfile: isOwnProfile, onEdit: onEdit, borderColor: borderColor, onOpenFollowers: onOpenFollowers, onOpenFollowing: onOpenFollowing }), _jsxs(Tabs, { variant: "instagram", children: [_jsxs(TabList, { borderColor: borderColor, children: [_jsx(Tab, { children: _jsxs(Flex, { align: "center", gap: 2, children: [_jsx(Box, { as: BsGrid3X3, "aria-hidden": true }), _jsx(Text, { display: { base: 'none', md: 'inline' }, children: "POST" })] }) }), _jsx(Tab, { children: _jsxs(Flex, { align: "center", gap: 2, children: [_jsx(Box, { as: BsBookmark, "aria-hidden": true }), _jsx(Text, { display: { base: 'none', md: 'inline' }, children: "SALVATI" })] }) }), _jsx(Tab, { children: _jsxs(Flex, { align: "center", gap: 2, children: [_jsx(Box, { as: MdOutlineRestaurant, "aria-hidden": true }), _jsx(Text, { display: { base: 'none', md: 'inline' }, children: "RISTORANTI" })] }) }), _jsx(Tab, { children: _jsxs(Flex, { align: "center", gap: 2, children: [_jsx(Box, { as: BsCalendarEvent, "aria-hidden": true }), _jsx(Text, { display: { base: 'none', md: 'inline' }, children: "CALENDARIO" })] }) })] }), _jsxs(TabPanels, { children: [_jsxs(TabPanel, { p: 0, children: [_jsxs(Flex, { justify: "space-between", align: "center", py: 3, px: 1, children: [_jsx(Text, { fontWeight: "semibold", children: isOwnProfile ? 'I tuoi post' : `I post di ${profileUser.username}` }), _jsxs(HStack, { children: [_jsx(Tooltip, { label: "Vista griglia", children: _jsx(IconButton, { "aria-label": "Vista griglia", size: "sm", icon: _jsx(BsGrid3X3, {}), variant: viewMode === 'grid' ? 'solid' : 'ghost', onClick: setGrid }) }), _jsx(Tooltip, { label: "Vista lista", children: _jsx(IconButton, { "aria-label": "Vista lista", size: "sm", icon: _jsx(FaList, {}), variant: viewMode === 'list' ? 'solid' : 'ghost', onClick: setList }) })] })] }), postsSorted.length === 0 ? (_jsx(Flex, { justify: "center", py: 12, children: _jsx(Text, { color: "gray.500", children: "Ancora nessun post" }) })) : viewMode === 'grid' ? (_jsx(ProfilePostGrid, { posts: postsSorted, username: profileUser.username })) : (_jsx(ProfilePostList, { posts: postsSorted, user: { username: profileUser.username, profilePic: profileUser.profilePic } }))] }), _jsx(TabPanel, { p: 0, children: _jsx(Flex, { justify: "center", py: 12, children: _jsx(Text, { color: "gray.500", children: "Contenuti salvati" }) }) }), _jsx(TabPanel, { p: 0, children: _jsx(Flex, { justify: "center", py: 12, children: _jsx(Text, { color: "gray.500", children: "Ristoranti" }) }) }), _jsx(TabPanel, { p: 0, children: _jsx(ProfileCalendar, { posts: postsSorted.filter((p) => !!p.imageAt), isLoading: loadingPosts }) })] })] })] }));
};
export default ProfileDetails;
