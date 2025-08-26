import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton, useToast } from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';
const ClearCacheButton = () => {
    const toast = useToast();
    const handleClearCache = async () => {
        try {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map((name) => caches.delete(name)));
            }
            localStorage.clear();
            sessionStorage.clear();
            toast({
                title: 'Cache pulita!',
                description: 'La cache è stata svuotata. La pagina verrà ricaricata...',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
        catch (error) {
            console.error('Errore durante lo svuotamento della cache:', error);
            toast({
                title: 'Errore',
                description: 'Impossibile svuotare la cache.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };
    return (_jsx(IconButton, { "aria-label": "Svuota cache e ricarica pagina", icon: _jsx(FaTrashAlt, { size: 20 }), variant: "ghost", onClick: handleClearCache, _hover: { transform: 'scale(1.1)', transition: 'transform 0.2s' } }));
};
export default ClearCacheButton;
