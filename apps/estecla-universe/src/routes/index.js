import { jsx as _jsx } from "react/jsx-runtime";
// src/routes/Routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import ErrorPage from '@pages/Error';
import { ProtectedRoute } from '@components/ProtectedRoute';
export const router = createBrowserRouter([
    {
        path: '/',
        element: (_jsx(ProtectedRoute, { children: _jsx(App, {}) })),
        errorElement: _jsx(ErrorPage, {}),
        children: [
            {
                index: true,
                async lazy() {
                    const { default: Home } = await import('@pages/Home');
                    return { Component: Home };
                },
            },
            {
                path: '/welcome',
                async lazy() {
                    const { default: Welcome } = await import('@pages/Welcome');
                    return { Component: Welcome };
                },
            },
            {
                path: '/profile/:username',
                async lazy() {
                    const { default: Profile } = await import('@pages/Profile');
                    return { Component: Profile };
                },
            },
            {
                path: '/countdown',
                async lazy() {
                    const { default: Countdown } = await import('@pages/Countdown');
                    return { Component: Countdown };
                },
            },
            {
                path: '/notifications',
                async lazy() {
                    const { default: Notifications } = await import('@pages/Notifications');
                    return { Component: Notifications };
                },
            },
            {
                path: '/settings',
                async lazy() {
                    const { default: Settings } = await import('@pages/Settings');
                    return { Component: Settings };
                },
            },
        ],
    },
    {
        path: '/login',
        async lazy() {
            const { default: Login } = await import('@pages/Login');
            return { Component: Login };
        },
        errorElement: _jsx(ErrorPage, {}),
    },
    {
        path: '/register',
        async lazy() {
            const { default: Register } = await import('@pages/Register');
            return { Component: Register };
        },
        errorElement: _jsx(ErrorPage, {}),
    },
]);
