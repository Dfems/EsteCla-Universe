import { useState, useEffect, useCallback, useMemo } from 'react'
import { Box, Flex, Text, Heading, useColorMode } from '@chakra-ui/react'
import useThemeColors from '@hooks/useThemeColors'
import Confetti from 'react-confetti'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Props {
  birthday: string // ISO YYYY-MM-DD
}

const BirthdayCountdown: React.FC<Props> = ({ birthday }) => {
  // Data di riferimento (solo mese/giorno dalla stringa birthday)
  const targetDate = useMemo(() => new Date(`${birthday}T00:00:00`), [birthday])
  const { colorMode } = useColorMode()
  const { containerBg, textColor: themeTextColor } = useThemeColors()

  // Funzione per calcolare il tempo residuo fino al prossimo compleanno
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date()
    const month = targetDate.getMonth()
    const day = targetDate.getDate()
    const currentYearTarget = new Date(now.getFullYear(), month, day, 0, 0, 0, 0)

    // Se il compleanno di quest'anno è già passato, usa l'anno successivo
    if (currentYearTarget.getTime() <= now.getTime()) {
      currentYearTarget.setFullYear(now.getFullYear() + 1)
    }

    const difference = currentYearTarget.getTime() - now.getTime()
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((difference / (1000 * 60)) % 60)
    const seconds = Math.floor((difference / 1000) % 60)

    return { days, hours, minutes, seconds }
  }, [targetDate])

  // Stato per il countdown e per verificare se il compleanno è arrivato
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [isBirthday, setIsBirthday] = useState<boolean>(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      // Se il tempo residuo è zero, il compleanno è arrivato
      if (
        newTimeLeft.days <= 0 &&
        newTimeLeft.hours <= 0 &&
        newTimeLeft.minutes <= 0 &&
        newTimeLeft.seconds <= 0
      ) {
        setIsBirthday(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const boxBg = colorMode === 'dark' ? 'pink.700' : 'pink.100'
  const countdownTextColor = colorMode === 'dark' ? 'pink.100' : 'pink.600'
  const headingColor = colorMode === 'dark' ? 'pink.300' : 'pink.600'
  const month = targetDate.getMonth()
  const day = targetDate.getDate()
  const displayDate = new Date(2000, month, day)

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="transparent" // oppure usa un colore semi-trasparente, es: 'rgba(255,255,255,0.7)'
      position="relative"
      p={4}
    >
      {isBirthday && <Confetti recycle={false} numberOfPieces={400} />}
      <Box bg={containerBg} p={8} borderRadius="xl" boxShadow="2xl" textAlign="center">
        <Heading mb={6} color={headingColor} fontFamily="Pacifico">
          {isBirthday
            ? '🎂 BUON COMPLEANNO MOGLIE MIA! 🥳'
            : '🎉 Compleanno di mia moglie in arrivo! 🎂'}
        </Heading>
        {!isBirthday ? (
          <Flex gap={4} justify="center" wrap="wrap">
            <TimeBox value={timeLeft.days} label="Giorni" bg={boxBg} color={countdownTextColor} />
            <TimeBox value={timeLeft.hours} label="Ore" bg={boxBg} color={countdownTextColor} />
            <TimeBox
              value={timeLeft.minutes}
              label="Minuti"
              bg={boxBg}
              color={countdownTextColor}
            />
            <TimeBox
              value={timeLeft.seconds}
              label="Secondi"
              bg={boxBg}
              color={countdownTextColor}
            />
          </Flex>
        ) : (
          <Text mt={2} color={themeTextColor}>
            Tanti auguri di cuore! 🎈
          </Text>
        )}
        <Text mt={6} color={themeTextColor}>
          Manca pochissimo al{' '}
          {displayDate.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
          })}
          !!!
          <br />
          Amo infinitamente mia moglie! ❤️
        </Text>
      </Box>
    </Flex>
  )
}

interface TimeBoxProps {
  value: number
  label: string
  bg: string
  color: string
}

const TimeBox: React.FC<TimeBoxProps> = ({ value, label, bg, color }) => (
  <Box
    p={4}
    minW="100px"
    borderRadius="lg"
    bg={bg}
    color={color}
    boxShadow="md"
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-4px)' }}
  >
    <Text fontSize="3xl" fontWeight="bold">
      {value.toString().padStart(2, '0')}
    </Text>
    <Text fontSize="sm" mt={1}>
      {label}
    </Text>
  </Box>
)

export default BirthdayCountdown
