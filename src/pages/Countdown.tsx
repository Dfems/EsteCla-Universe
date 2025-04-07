import BirthdayCountdown from '../components/BirthdayCountdown'
import { Box, Image } from '@chakra-ui/react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Array di URL per le immagini di sfondo (modifica a tuo piacimento)
const imageUrls = [
  'https://source.unsplash.com/1600x900/?birthday',
  'https://source.unsplash.com/1600x900/?party',
  'https://source.unsplash.com/1600x900/?celebration',
  'https://source.unsplash.com/1600x900/?cake',
]

const Countdown = () => {
  const settings = {
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
    <Box position="relative" minH="100vh" overflow="hidden">
      {/* Galleria scorrevole come sfondo */}
      <Box position="absolute" top="0" left="0" width="100%" height="100%" zIndex="-1">
        <Slider {...settings}>
          {imageUrls.map((url, idx) => (
            <Box key={idx} height="100vh">
              <Image src={url} alt={`Slide ${idx}`} objectFit="cover" width="100%" height="100%" />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Countdown in primo piano */}
      <BirthdayCountdown />
    </Box>
  )
}

export default Countdown
