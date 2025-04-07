import { useState, useEffect, useCallback } from 'react'
import { Box, Flex, Text, Heading, useColorModeValue } from '@chakra-ui/react'
import Confetti from 'react-confetti'
import { TimeLeft } from '../types/interfaces'

const BirthdayCountdown = () => {
  const [targetDate] = useState<Date>(new Date('2024-08-15')) // Imposta la data del compleanno qui
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft())
  const [isBirthday, setIsBirthday] = useState(false)

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date()
    const target = new Date(targetDate)
    target.setFullYear(now.getFullYear())

    if (target < now) {
      target.setFullYear(now.getFullYear() + 1)
    }

    const difference = target.getTime() - now.getTime()
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    if (days + hours + minutes + seconds <= 0) {
      setIsBirthday(true)
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return { days, hours, minutes, seconds }
  }, [targetDate])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const boxBg = useColorModeValue('pink.100', 'pink.700')
  const textColor = useColorModeValue('pink.600', 'pink.100')

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, pink.400, purple.600)"
      position="relative"
      p={4}
    >
      {isBirthday && <Confetti recycle={false} numberOfPieces={400} />}

      <Box bg="whiteAlpha.900" p={8} borderRadius="xl" boxShadow="2xl" textAlign="center">
        <Heading mb={6} color="pink.600" fontFamily="Pacifico">
          🎉 Compleanno in Arrivo! 🎂
        </Heading>

        {!isBirthday ? (
          <Flex gap={4} justify="center" wrap="wrap">
            <TimeBox value={timeLeft.days} label="Giorni" bg={boxBg} color={textColor} />
            <TimeBox value={timeLeft.hours} label="Ore" bg={boxBg} color={textColor} />
            <TimeBox value={timeLeft.minutes} label="Minuti" bg={boxBg} color={textColor} />
            <TimeBox value={timeLeft.seconds} label="Secondi" bg={boxBg} color={textColor} />
          </Flex>
        ) : (
          <Box>
            <Text fontSize="3xl" fontWeight="bold" color="pink.600">
              🎂 BUON COMPLEANNO! 🥳
            </Text>
            <Text mt={2} color="gray.600">
              Tanti auguri di cuore! 🎈
            </Text>
          </Box>
        )}

        <Text mt={6} color="gray.600">
          Festeggeremo il{' '}
          {targetDate.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </Box>
    </Flex>
  )
}

const TimeBox = ({
  value,
  label,
  bg,
  color,
}: {
  value: number
  label: string
  bg: string
  color: string
}) => (
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
