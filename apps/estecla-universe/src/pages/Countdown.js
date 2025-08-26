import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import BirthdayCountdown from '@/features/birthday/ui/BirthdayCountdown';
import { Box, Image, Spinner, Alert, AlertIcon, Button } from '@chakra-ui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
const CACHE_KEY = 'unsplashImagesCache';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 1 giorno in millisecondi
const Countdown = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Le query per cercare le immagini
    const queries = useMemo(() => ['birthday', 'party', 'wine'], []);
    const NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    useEffect(() => {
        const fetchImages = async () => {
            try {
                if (!NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
                    setError("Chiave Unsplash mancante. Imposta VITE_UNSPLASH_ACCESS_KEY nell'env.");
                    setLoading(false);
                    return;
                }
                const fetchedUrls = await Promise.all(queries.map(async (query) => {
                    const res = await fetch(`https://api.unsplash.com/photos/random?query=${query}&orientation=landscape`, {
                        headers: {
                            Authorization: `Client-ID ${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
                        },
                    });
                    if (!res.ok) {
                        throw new Error(`Errore nella fetch per la query "${query}"`);
                    }
                    const data = await res.json();
                    return data.urls.regular;
                }));
                // Salva i dati in cache insieme a un timestamp
                const cacheData = { timestamp: Date.now(), imageUrls: fetchedUrls };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                setImageUrls(fetchedUrls);
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Errore durante il recupero delle immagini:', err);
                    setError(err.message);
                }
                else {
                    console.error('Errore sconosciuto durante il recupero delle immagini');
                    setError('Errore sconosciuto');
                }
            }
            finally {
                setLoading(false);
            }
        };
        // Prova a leggere la cache
        const cachedDataStr = localStorage.getItem(CACHE_KEY);
        if (cachedDataStr) {
            try {
                const cachedData = JSON.parse(cachedDataStr);
                // Verifica se la cache è ancora valida
                if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
                    setImageUrls(cachedData.imageUrls);
                    setLoading(false);
                    return; // Esci dall'useEffect se abbiamo dati validi in cache
                }
            }
            catch (error) {
                console.error('Errore nel parsing dei dati in cache', error);
            }
        }
        // Se non ci sono dati in cache o sono scaduti, fai la fetch
        fetchImages();
    }, [queries, NEXT_PUBLIC_UNSPLASH_ACCESS_KEY]);
    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 30000, // 10 secondi
        fade: true,
        cssEase: 'linear',
        centerMode: false,
        centerPadding: '0px',
    };
    return (_jsx(Box, { position: "relative", minH: "100svh", overflow: "hidden", m: 0, p: 0, children: authLoading || loading ? (_jsx(Box, { display: "flex", alignItems: "center", justifyContent: "center", height: "100svh", children: _jsx(Spinner, { size: "xl" }) })) : error ? (_jsx(Box, { textAlign: "center", pt: { base: 4, md: 20 }, children: _jsxs("p", { children: ["Si \u00E8 verificato un errore: ", error] }) })) : !user?.birthday ? (_jsxs(Box, { maxW: "700px", mx: "auto", pt: { base: 4, md: 20 }, px: 4, children: [_jsxs(Alert, { status: "warning", borderRadius: "md", children: [_jsx(AlertIcon, {}), _jsx(Box, { children: "Per visualizzare il countdown, imposta prima la tua data di compleanno nelle impostazioni del profilo." })] }), _jsxs(Box, { mt: 4, display: "flex", gap: 2, children: [_jsx(Button, { colorScheme: "blue", onClick: () => navigate(`/profile/${user?.username}`), children: "Vai al profilo" }), _jsx(Button, { variant: "outline", onClick: () => navigate('/'), children: "Home" })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Box, { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "-1", children: _jsx(Slider, { ...settings, children: imageUrls.map((url, idx) => (_jsx(Box, { height: "100svh", children: _jsx(Image, { src: url, alt: `Slide ${idx}`, objectFit: "cover", width: "100%", height: "100%" }) }, idx))) }) }), _jsx(BirthdayCountdown, { birthday: user.birthday, fullName: user.fullName, bio: user.bio })] })) }));
};
export default Countdown;
