import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import { registerWithEmailPassword } from '@features/auth/api/auth';
import useThemeColors from '@hooks/useThemeColors';
const Register = () => {
    const navigate = useNavigate();
    const { containerBg, textColor } = useThemeColors();
    // const { toggleColorMode } = useColorMode()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const calculateAge = (dateStr) => {
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime()))
            return NaN;
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate()))
            age--;
        return age;
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Validazione username semplice
            const trimmedUsername = username.trim();
            if (!/^([a-zA-Z0-9_.-]){3,20}$/.test(trimmedUsername)) {
                throw new Error('Username non valido. Usa 3-20 caratteri alfanumerici, punto, trattino o underscore.');
            }
            // Validazione data di compleanno (opzionale ma, se presente, età minima 13)
            if (birthday) {
                const age = calculateAge(birthday);
                if (Number.isNaN(age)) {
                    throw new Error('Data di compleanno non valida.');
                }
                if (age < 13) {
                    throw new Error('Devi avere almeno 13 anni per registrarti.');
                }
                const max = new Date().toISOString().split('T')[0];
                if (birthday > max) {
                    throw new Error('La data di compleanno non può essere nel futuro.');
                }
            }
            // Registrazione tramite API centralizzata
            const userData = await registerWithEmailPassword({
                email,
                password,
                username: trimmedUsername,
                fullName,
                birthday,
                profilePicFile,
            });
            if (userData)
                navigate('/');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicFile(e.target.files[0]);
        }
    };
    return (_jsx(Center, { minH: "100vh", bg: containerBg, color: textColor, children: _jsxs(Box, { as: "form", onSubmit: handleRegister, bg: containerBg, p: 8, borderRadius: "lg", boxShadow: "lg", w: "100%", maxW: "400px", children: [_jsx(Heading, { size: "lg", mb: 6, children: "Register" }), error && (_jsx(Box, { color: "red.500", mb: 4, children: error })), _jsxs(FormControl, { isRequired: true, mb: 4, children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email" })] }), _jsxs(FormControl, { isRequired: true, mb: 4, children: [_jsx(FormLabel, { children: "Password" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "new-password", minLength: 6 })] }), _jsxs(FormControl, { isRequired: true, mb: 4, children: [_jsx(FormLabel, { children: "Username" }), _jsx(Input, { type: "text", value: username, onChange: (e) => setUsername(e.target.value) })] }), _jsxs(FormControl, { mb: 4, children: [_jsx(FormLabel, { children: "Full Name" }), _jsx(Input, { type: "text", value: fullName, onChange: (e) => setFullName(e.target.value) })] }), _jsxs(FormControl, { mb: 4, children: [_jsx(FormLabel, { children: "Birthday" }), _jsx(Input, { type: "date", value: birthday, onChange: (e) => setBirthday(e.target.value), max: new Date().toISOString().split('T')[0] })] }), _jsxs(FormControl, { mb: 6, children: [_jsx(FormLabel, { children: "Profile Picture" }), _jsx(Input, { type: "file", accept: "image/*", onChange: handleFileChange })] }), _jsx(Button, { type: "submit", colorScheme: "blue", isLoading: loading, loadingText: "Registering...", w: "100%", mb: 4, children: "Register" }), _jsx(Button, { variant: "outline", w: "100%", onMouseEnter: () => import('@pages/Login'), onClick: () => navigate('/login'), children: "Hai gi\u00E0 un account? Fai il Login" })] }) }));
};
export default Register;
