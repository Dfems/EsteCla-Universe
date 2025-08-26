import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import { loginWithEmailPassword, loginWithGoogleAndEnsureUser } from '@features/auth/api/auth';
import GoogleLoginButton from '@components/ui/GoogleLoginButton';
import useThemeColors from '@hooks/useThemeColors';
// import { useColorMode } from '@chakra-ui/react'
const Login = () => {
    const navigate = useNavigate();
    const { containerBg, textColor } = useThemeColors();
    // const { toggleColorMode } = useColorMode()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await loginWithEmailPassword(email, password);
            navigate('/welcome');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogleAndEnsureUser();
            navigate('/welcome');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Google login failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Center, { minH: "100vh", bg: containerBg, color: textColor, children: _jsxs(Box, { as: "form", onSubmit: handleEmailLogin, bg: containerBg, p: 8, borderRadius: "lg", boxShadow: "lg", w: "100%", maxW: "400px", children: [_jsx(Heading, { size: "lg", mb: 6, children: "Login" }), error && (_jsx(Box, { color: "red.500", mb: 4, children: error })), _jsxs(FormControl, { isRequired: true, mb: 4, children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email" })] }), _jsxs(FormControl, { isRequired: true, mb: 6, children: [_jsx(FormLabel, { children: "Password" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "current-password" })] }), _jsx(Button, { type: "submit", colorScheme: "blue", isLoading: loading, loadingText: "Logging in...", w: "100%", mb: 4, children: "Login" }), _jsx(GoogleLoginButton, { onClick: handleGoogleLogin, isLoading: loading }), _jsx(Button, { variant: "outline", w: "100%", onMouseEnter: () => import('@pages/Register'), onClick: () => navigate('/register'), children: "Non hai un account? Registrati" })] }) }));
};
export default Login;
