import React, { useState, useEffect, useMemo } from 'react'
import BirthdayCountdown from '../components/BirthdayCountdown'
import { Box, Image, Spinner } from '@chakra-ui/react'
import Slider, { Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface UnsplashResponse {
  urls: {
    regular: string
  }
}

const Countdown: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const queries = useMemo(() => ['birthday', 'party', 'wine'], [])
  const NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = 'lBe600fCqDc_a8HhEKcw2WCNc7KHzxf1z_qnf2TKLyk'

  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      try {
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

    fetchImages()
  }, [queries])

  const settings: Settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    cssEase: 'linear',
  }

  return (
    <Box position="relative" minH="100vh" overflow="hidden" margin={0} padding={0}>
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Spinner size="xl" />
        </Box>
      ) : error ? (
        <Box textAlign="center" pt="20">
          <p>Si è verificato un errore: {error}</p>
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
          <BirthdayCountdown />
        </>
      )}
    </Box>
  )
}

export default Countdown
