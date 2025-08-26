import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { VisuallyHidden, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import useThemeColors from '@hooks/useThemeColors';
import NavbarDesktop from '@components/navbar/NavbarDesktop';
import NavbarMobile from '@components/navbar/NavbarMobile';
import UploadModal from '@components/navbar/UploadModal';
import { useNavbarUpload } from '@hooks/useNavbarUpload';
import useUnreadNotifications from '@features/notifications/hooks/useUnreadNotifications';
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { containerBg, borderColor, textColor } = useThemeColors();
    const bg = containerBg;
    const refresh = () => window.location.reload();
    const { fileInputRef, uploading, isOpen, caption, setCaption, previewUrl, openFilePicker, handleFileChange, closeModal, handleConfirmUpload, imageDateISO, setImageDateISO, sameAsPublish, setSameAsPublish, } = useNavbarUpload(user);
    const goHome = () => navigate('/');
    const goNotifications = () => navigate('/notifications');
    const goProfile = () => user ? navigate(`/profile/${user.username || 'me'}`) : navigate('/login');
    const unread = useUnreadNotifications();
    const Desktop = () => (_jsx(NavbarDesktop, { bg: bg, borderColor: borderColor, textColor: textColor, userProfilePic: user?.profilePic, uploading: uploading, onHome: goHome, onUpload: () => {
            if (!openFilePicker())
                navigate('/login');
        }, onRefresh: refresh, onProfile: goProfile, onLogout: logout, notifications: { count: unread, onOpen: goNotifications } }));
    const Mobile = () => (_jsx(NavbarMobile, { bg: bg, borderColor: borderColor, uploading: uploading, onHome: goHome, onUpload: () => {
            if (!openFilePicker())
                navigate('/login');
        }, onRefresh: refresh, onProfile: goProfile, userProfilePic: user?.profilePic, notifications: { count: unread, onOpen: goNotifications } }));
    return (_jsxs(_Fragment, { children: [_jsx(Desktop, {}), _jsx(Mobile, {}), _jsx(VisuallyHidden, { children: _jsx(Input, { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileChange }) }), _jsx(UploadModal, { isOpen: isOpen, previewUrl: previewUrl, caption: caption, onCaptionChange: setCaption, onCancel: closeModal, onConfirm: handleConfirmUpload, uploading: uploading, imageDateISO: imageDateISO, onImageDateChange: setImageDateISO, sameAsPublish: sameAsPublish, onSameAsPublishChange: setSameAsPublish })] }));
};
export default Navbar;
