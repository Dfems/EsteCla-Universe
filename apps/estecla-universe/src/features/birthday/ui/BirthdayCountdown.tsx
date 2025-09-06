import { Box, Flex, Heading, Text, useColorMode } from '@chakra-ui/react'
import { useThemeColors } from '@estecla/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Confetti from 'react-confetti'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Props {
  birthday: string // ISO YYYY-MM-DD
  fullName?: string
  bio?: string
}

const BirthdayCountdown = ({ birthday, fullName, bio }: Props) => {
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

  const leadPhrase = useMemo(() => {
    const d = timeLeft.days
    const h = timeLeft.hours
    const m = timeLeft.minutes
    if (d > 30) return "C'è ancora tempo fino al"
    if (d > 7) return 'Si avvicina il grande giorno, il'
    if (d > 1) return 'Manca pochissimo al'
    if (d === 1) return 'Domani è il grande giorno:'
    if (h >= 1) return `Solo ${h} ${h === 1 ? 'ora' : 'ore'} al`
    if (m >= 1) return `Solo ${m} ${m === 1 ? 'minuto' : 'minuti'} al`
    return 'Tra pochissimi istanti, il'
  }, [timeLeft.days, timeLeft.hours, timeLeft.minutes])

  return (
    <Flex
      minH="100svh"
      align="center"
      justify={{ base: 'flex-start', md: 'center' }}
      bg="transparent"
      position="relative"
      p={{ base: 2, md: 4 }}
    >
      {isBirthday && <Confetti recycle={false} numberOfPieces={400} />}
      <Box
        bg={containerBg}
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        textAlign="center"
        mt={{ base: 4, md: 0 }}
      >
        <Heading mb={6} color={headingColor} fontFamily="Pacifico">
          {isBirthday
            ? '🎂 BUON COMPLEANNO MOGLIE MIA! 🥳'
            : `🎉 Compleanno di ${fullName ?? 'una persona speciale'} in arrivo! 🎂`}
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
          {leadPhrase}{' '}
          {displayDate.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
          })}
          !!!
          <br />
          {bio ?? ''}
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

const TimeBox = ({ value, label, bg, color }: TimeBoxProps) => (
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
