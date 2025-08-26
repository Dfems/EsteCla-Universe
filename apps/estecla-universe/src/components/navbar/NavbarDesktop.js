import { jsx as _jsx } from "react/jsx-runtime";
import DesktopBar from '@components/navbar/DesktopBar';
const NavbarDesktop = ({ bg, borderColor, textColor, userProfilePic, uploading, onHome, onUpload, onRefresh, onProfile, onLogout, notifications, }) => (_jsx(DesktopBar, { bg: bg, borderColor: borderColor, textColor: textColor, userProfilePic: userProfilePic, uploading: uploading, onHome: onHome, onUpload: onUpload, onRefresh: onRefresh, onProfile: onProfile, onLogout: onLogout, notifications: notifications }));
export default NavbarDesktop;
