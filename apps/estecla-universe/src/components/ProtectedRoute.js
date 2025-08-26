import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import LoadingSpinner from '@components/ui/LoadingSpinner';
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx(LoadingSpinner, {});
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
};
