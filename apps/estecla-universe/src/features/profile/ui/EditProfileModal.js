import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useToast, } from '@chakra-ui/react';
import { updateUserProfile } from '@features/profile/api/profile';
const EditProfileModal = ({ isOpen, onClose, user }) => {
    const toast = useToast();
    const [fullName, setFullName] = useState(user.fullName || '');
    const [bio, setBio] = useState(user.bio || '');
    const [username, setUsername] = useState(user.username);
    const [birthday, setBirthday] = useState(user.birthday || '');
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [saving, setSaving] = useState(false);
    // age calculation moved into API
    useEffect(() => {
        if (isOpen) {
            setFullName(user.fullName || '');
            setBio(user.bio || '');
            setUsername(user.username);
            setBirthday(user.birthday || '');
            setProfilePicFile(null);
        }
    }, [isOpen, user]);
    const previewUrl = useMemo(() => {
        if (profilePicFile)
            return URL.createObjectURL(profilePicFile);
        return user.profilePic || '';
    }, [profilePicFile, user.profilePic]);
    const onFileChange = (e) => {
        if (e.target.files && e.target.files[0])
            setProfilePicFile(e.target.files[0]);
    };
    const save = async () => {
        setSaving(true);
        try {
            await updateUserProfile({
                current: user,
                updates: {
                    username,
                    fullName,
                    bio,
                    birthday,
                    profilePicFile,
                },
            });
            toast({ status: 'success', title: 'Profilo aggiornato' });
            onClose();
        }
        catch (e) {
            const message = e instanceof Error ? e.message : 'Salvataggio fallito';
            toast({ status: 'error', title: 'Errore', description: message });
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs(Modal, { isOpen: isOpen, onClose: onClose, isCentered: true, children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: "Modifica profilo" }), _jsxs(ModalBody, { children: [_jsxs(Box, { display: "flex", gap: 4, alignItems: "center", mb: 4, children: [_jsx(Avatar, { src: previewUrl, name: username, size: "lg" }), _jsx(Input, { type: "file", accept: "image/*", onChange: onFileChange, alignContent: "center" })] }), _jsxs(FormControl, { mb: 3, children: [_jsx(FormLabel, { children: "Username" }), _jsx(Input, { value: username, onChange: (e) => setUsername(e.target.value) })] }), _jsxs(FormControl, { mb: 3, children: [_jsx(FormLabel, { children: "Nome completo" }), _jsx(Input, { value: fullName, onChange: (e) => setFullName(e.target.value) })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Bio" }), _jsx(Textarea, { value: bio, onChange: (e) => setBio(e.target.value), rows: 4 })] }), _jsxs(FormControl, { mt: 3, children: [_jsx(FormLabel, { children: "Data di nascita" }), _jsx(Input, { type: "date", value: birthday, onChange: (e) => setBirthday(e.target.value), max: new Date().toISOString().split('T')[0] })] })] }), _jsxs(ModalFooter, { children: [_jsx(Button, { mr: 3, onClick: onClose, variant: "ghost", children: "Annulla" }), _jsx(Button, { colorScheme: "blue", onClick: save, isLoading: saving, loadingText: "Salvo...", children: "Salva" })] })] })] }));
};
export default EditProfileModal;
