import React, { useState, useEffect, useMemo } from 'react'
import BirthdayCountdown from '../components/BirthdayCountdown'
import { Box, Image, Spinner, Alert, AlertIcon, Button } from '@chakra-ui/react'
import Slider, { Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface UnsplashResponse {
  urls: {
    regular: string
  }
}

// Interfaccia per la cache
interface CacheData {
  timestamp: number
  imageUrls: string[]
}

const CACHE_KEY = 'unsplashImagesCache'
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000 // 1 giorno in millisecondi

const Countdown: React.FC = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Le query per cercare le immagini
  const queries = useMemo(() => ['birthday', 'party', 'wine'], [])
  const NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string

  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      try {
        if (!NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
          setError("Chiave Unsplash mancante. Imposta VITE_UNSPLASH_ACCESS_KEY nell'env.")
          setLoading(false)
          return
        }
        const fetchedUrls: string[] = await Promise.all(
          queries.map(async (query: string): Promise<string> => {
            const res: Response = await fetch(
              `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape`,
              {
                headers: {
                  Authorization: `Client-ID ${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
                },
              }
            )
            if (!res.ok) {
              throw new Error(`Errore nella fetch per la query "${query}"`)
            }
            const data: UnsplashResponse = await res.json()
            return data.urls.regular
          })
        )
        // Salva i dati in cache insieme a un timestamp
        const cacheData: CacheData = { timestamp: Date.now(), imageUrls: fetchedUrls }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        setImageUrls(fetchedUrls)
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Errore durante il recupero delle immagini:', err)
          setError(err.message)
        } else {
          console.error('Errore sconosciuto durante il recupero delle immagini')
          setError('Errore sconosciuto')
        }
      } finally {
        setLoading(false)
      }
    }

    // Prova a leggere la cache
    const cachedDataStr = localStorage.getItem(CACHE_KEY)
    if (cachedDataStr) {
      try {
        const cachedData: CacheData = JSON.parse(cachedDataStr)
        // Verifica se la cache è ancora valida
        if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
          setImageUrls(cachedData.imageUrls)
          setLoading(false)
          return // Esci dall'useEffect se abbiamo dati validi in cache
        }
      } catch (error) {
        console.error('Errore nel parsing dei dati in cache', error)
      }
    }

    // Se non ci sono dati in cache o sono scaduti, fai la fetch
    fetchImages()
  }, [queries, NEXT_PUBLIC_UNSPLASH_ACCESS_KEY])

  const settings: Settings = {
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
  }

  return (
    <Box position="relative" minH="100vh" overflow="hidden" m={0} p={0}>
      {authLoading || loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Spinner size="xl" />
        </Box>
      ) : error ? (
        <Box textAlign="center" pt="20">
          <p>Si è verificato un errore: {error}</p>
        </Box>
      ) : !user?.birthday ? (
        <Box maxW="700px" mx="auto" pt="20" px={4}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Box>
              Per visualizzare il countdown, imposta prima la tua data di compleanno nelle
              impostazioni del profilo.
            </Box>
          </Alert>
          <Box mt={4} display="flex" gap={2}>
            <Button colorScheme="blue" onClick={() => navigate(`/profile/${user?.username}`)}>
              Vai al profilo
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Home
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {/* Slider come sfondo */}
          <Box position="absolute" top="0" left="0" width="100%" height="100%" zIndex="-1">
            <Slider {...settings}>
              {imageUrls.map((url: string, idx: number) => (
                <Box key={idx} height="100vh">
                  <Image
                    src={url}
                    alt={`Slide ${idx}`}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </Box>
              ))}
            </Slider>
          </Box>
          {/* Countdown in primo piano */}
          <BirthdayCountdown birthday={user.birthday} />
        </>
      )}
    </Box>
  )
}

export default Countdown
