import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, Grid, GridItem, IconButton, Image, Text, Tooltip, Button, Skeleton, Badge, } from '@chakra-ui/react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useProfileCalendar } from '@features/profile/hooks/useProfileCalendar';
import ProfileCalendarModal from './ProfileCalendarModal';
function CalendarHeader({ monthLabel, goPrev, goToday, goNext, }) {
    return (_jsxs(Flex, { justify: "space-between", align: "center", mb: 3, children: [_jsx(Text, { fontWeight: "semibold", textTransform: "capitalize", children: monthLabel }), _jsxs(Flex, { gap: 2, align: "center", children: [_jsx(Tooltip, { label: "Mese precedente", children: _jsx(IconButton, { "aria-label": "Mese precedente", size: "sm", icon: _jsx(BsChevronLeft, {}), onClick: goPrev }) }), _jsx(Tooltip, { label: "Vai a oggi", children: _jsx(Button, { "aria-label": "Oggi", size: "sm", onClick: goToday, children: "Oggi" }) }), _jsx(Tooltip, { label: "Mese successivo", children: _jsx(IconButton, { "aria-label": "Mese successivo", size: "sm", icon: _jsx(BsChevronRight, {}), onClick: goNext }) })] })] }));
}
function CalendarWeekHeader({ weekLabels }) {
    return (_jsx(Grid, { templateColumns: "repeat(7, 1fr)", gap: 1, mb: 1, children: weekLabels.map((w, i) => (_jsx(GridItem, { textAlign: "center", fontSize: "xs", color: "gray.500", children: w }, `${w}-${i}`))) }));
}
function CalendarGrid({ isLoading, cells, openFor, }) {
    if (isLoading) {
        return (_jsx(Grid, { templateColumns: "repeat(7, 1fr)", gap: 1, children: Array.from({ length: 42 }).map((_, i) => (_jsx(GridItem, { minH: "64px", children: _jsx(Skeleton, { h: "64px", borderRadius: "md" }) }, i))) }));
    }
    return (_jsx(Grid, { templateColumns: "repeat(7, 1fr)", gap: 1, children: cells.map((cell) => {
            const hasPosts = cell.posts.length > 0;
            const preview = hasPosts ? cell.posts[0] : null;
            const gridItem = (_jsx(GridItem, { minH: "64px", borderWidth: "1px", borderRadius: "md", overflow: "hidden", opacity: cell.inMonth ? 1 : 0.35, cursor: hasPosts ? 'pointer' : 'default', onClick: () => (hasPosts ? openFor(cell.key) : undefined), children: _jsxs(Box, { position: "relative", h: "100%", children: [_jsx(Text, { position: "absolute", top: 1, left: 2, fontSize: "xs", fontWeight: cell.isToday ? 'bold' : 'normal', children: cell.date.getDate() }), hasPosts ? (_jsx(Image, { src: preview.imageUrl, alt: preview.caption, w: "100%", h: "100%", objectFit: "cover" })) : null, hasPosts ? (_jsx(Badge, { position: "absolute", bottom: 1, right: 1, fontSize: "0.65em", colorScheme: "purple", borderRadius: "full", px: 2, py: 0.5, children: cell.posts.length })) : null] }) }, cell.key));
            return hasPosts ? (_jsx(Tooltip, { hasArrow: true, openDelay: 200, label: _jsxs(Box, { maxW: "140px", children: [_jsx(Image, { src: preview.imageUrl, alt: preview.caption, w: "100%", h: "100px", objectFit: "cover", borderRadius: "md" }), preview.caption ? (_jsx(Text, { mt: 1, fontSize: "xs", noOfLines: 2, children: preview.caption })) : null] }), children: gridItem }, cell.key)) : (gridItem);
        }) }));
}
export default function ProfileCalendar({ posts, isLoading }) {
    const { monthLabel, weekLabels, cells, goPrev, goNext, goToday, openFor, close, selectedKey, selectedPosts, } = useProfileCalendar(posts);
    return (_jsxs(Box, { px: 1, py: 3, children: [_jsx(CalendarHeader, { monthLabel: monthLabel, goPrev: goPrev, goToday: goToday, goNext: goNext }), _jsx(CalendarWeekHeader, { weekLabels: weekLabels }), _jsx(CalendarGrid, { isLoading: isLoading, cells: cells, openFor: openFor }), _jsx(ProfileCalendarModal, { isOpen: !!selectedKey, onClose: close, dateKey: selectedKey, posts: selectedPosts })] }));
}
