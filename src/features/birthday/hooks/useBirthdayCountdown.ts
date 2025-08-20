import { useEffect, useState } from 'react'

/**
 * Calcola i secondi mancanti al prossimo compleanno dato una data 'YYYY-MM-DD'.
 * Restituisce null se la data non è valida.
 */
export function useBirthdayCountdown(birthday?: string | null): number | null {
  const [secsToBirthday, setSecsToBirthday] = useState<number | null>(null)

  useEffect(() => {
    if (!birthday) {
      setSecsToBirthday(null)
      return
    }
    const compute = () => {
      const [y, m, d] = birthday.split('-').map((n) => parseInt(n, 10))
      if (!y || !m || !d) {
        setSecsToBirthday(null)
        return
      }
      const now = new Date()
      const currentYear = now.getFullYear()
      let next = new Date(currentYear, m - 1, d, 0, 0, 0, 0)
      if (next.getTime() < now.getTime()) {
        next = new Date(currentYear + 1, m - 1, d, 0, 0, 0, 0)
      }
      const secs = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000))
      setSecsToBirthday(secs)
    }
    compute()
    const id = setInterval(compute, 60_000)
    return () => clearInterval(id)
  }, [birthday])

  return secsToBirthday
}
