import { useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useUploadPost } from '@hooks/useUploadPost';
export function useNavbarUpload(user) {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const { isOpen, caption, setCaption, previewUrl, uploading: modalUploading, pickFile, cancel, confirmUpload, imageDateISO, setImageDateISO, sameAsPublish, setSameAsPublish, } = useUploadPost();
    const openFilePicker = () => {
        if (!user)
            return false;
        fileInputRef.current?.click();
        return true;
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file || !user)
            return;
        pickFile(file);
    };
    const closeModal = () => {
        cancel();
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    const handleConfirmUpload = async () => {
        if (!user)
            return;
        setUploading(true);
        try {
            const url = await confirmUpload(user.uid);
            toast({
                status: 'success',
                title: 'Post pubblicato',
                description: 'URL copiato negli appunti',
            });
            await navigator.clipboard.writeText(url).catch(() => { });
            closeModal();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Upload fallito';
            toast({ status: 'error', title: 'Errore upload', description: message });
        }
        finally {
            setUploading(false);
        }
    };
    return {
        fileInputRef,
        uploading: uploading || modalUploading,
        isOpen,
        caption,
        setCaption,
        previewUrl,
        openFilePicker,
        handleFileChange,
        closeModal,
        handleConfirmUpload,
        imageDateISO,
        setImageDateISO,
        sameAsPublish,
        setSameAsPublish,
    };
}
