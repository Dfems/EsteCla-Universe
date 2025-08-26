import { jsx as _jsx } from "react/jsx-runtime";
import MobileBar from '@components/navbar/MobileBar';
const NavbarMobile = ({ bg, borderColor, uploading, onHome, onUpload, onRefresh, onProfile, userProfilePic, notifications, }) => (_jsx(MobileBar, { bg: bg, borderColor: borderColor, uploading: uploading, onHome: onHome, onUpload: onUpload, onRefresh: onRefresh, onProfile: onProfile, userProfilePic: userProfilePic, notifications: notifications }));
export default NavbarMobile;
