import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWelcomeGate } from '@hooks/useWelcomeGate';
export default function WelcomeGate({ children }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { shouldShowWelcome, setLastSeenNow } = useWelcomeGate();
    useEffect(() => {
        // Only gate the home route ('/') to avoid blocking deep links
        if (pathname === '/') {
            if (shouldShowWelcome()) {
                navigate('/welcome', { replace: true });
                return;
            }
            // App opened within activity window: refresh last seen
            setLastSeenNow();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);
    return _jsx(_Fragment, { children: children });
}
