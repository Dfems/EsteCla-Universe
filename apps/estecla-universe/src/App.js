import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '@components/Navbar';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import WelcomeGate from '@components/WelcomeGate';
export default function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx("main", { className: "content", children: _jsx(WelcomeGate, { children: _jsx(Suspense, { fallback: _jsx(LoadingSpinner, {}), children: _jsx(Outlet, {}) }) }) })] }));
}
