import { useCallback, useMemo, useState } from 'react'
import { Post } from '@models/interfaces'

function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

function getWeekdayIndexMonFirst(jsWeekday: number): number {
  // Monday-first calendar
  return (jsWeekday + 6) % 7
}

export interface CalendarCell {
  key: string
  date: Date
  inMonth: boolean
  isToday: boolean
  posts: Post[]
}

export interface UseProfileCalendarResult {
  current: Date
  monthLabel: string
  weekLabels: string[]
  cells: CalendarCell[]
  postsByDate: Map<string, Post[]>
  goPrev: () => void
  goNext: () => void
  goToday: () => void
  selectedKey: string | null
  openFor: (key: string) => void
  close: () => void
  selectedPosts: Post[]
}

export function useProfileCalendar(posts: Post[]): UseProfileCalendarResult {
  const [current, setCurrent] = useState<Date>(new Date())
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  // Group posts by YYYY-MM-DD and sort within the day by most recent
  const postsByDate = useMemo(() => {
    const map = new Map<string, Post[]>()
    for (const p of posts) {
      if (!p.imageAt) continue
      const key = toISODate(p.imageAt)
      const list = map.get(key) ?? []
      list.push(p)
      map.set(key, list)
    }
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => {
        const ta = (a.imageAt ?? a.publishAt ?? a.createdAt ?? a.timestamp ?? new Date(0)).getTime()
        const tb = (b.imageAt ?? b.publishAt ?? b.createdAt ?? b.timestamp ?? new Date(0)).getTime()
        return tb - ta
      })
      map.set(k, list)
    }
    return map
  }, [posts])

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const daysInMonth = monthEnd.getDate()
  const startPad = getWeekdayIndexMonFirst(monthStart.getDay()) // 0..6
  const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7

  const cells = useMemo<CalendarCell[]>(() => {
    const arr: CalendarCell[] = []
    const firstCellDate = new Date(monthStart)
    firstCellDate.setDate(firstCellDate.getDate() - startPad)
    const todayKey = toISODate(new Date())
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(firstCellDate)
      d.setDate(firstCellDate.getDate() + i)
      const key = toISODate(d)
      arr.push({
        key,
        date: d,
        inMonth: d.getMonth() === current.getMonth(),
        isToday: key === todayKey,
        posts: postsByDate.get(key) ?? [],
      })
    }
    return arr
  }, [current, monthStart, startPad, totalCells, postsByDate])

  const goPrev = useCallback(() => {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
  }, [])
  const goNext = useCallback(() => {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
  }, [])
  const goToday = useCallback(() => {
    setCurrent(new Date())
  }, [])

  const openFor = useCallback((key: string) => setSelectedKey(key), [])
  const close = useCallback(() => setSelectedKey(null), [])

  const selectedPosts = useMemo(() => {
    if (!selectedKey) return []
    return postsByDate.get(selectedKey) ?? []
  }, [selectedKey, postsByDate])

  const monthLabel = current.toLocaleDateString('it-IT', {
    month: 'long',
    year: 'numeric',
  })
  const weekLabels = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

  return {
    current,
    monthLabel,
    weekLabels,
    cells,
    postsByDate,
    goPrev,
    goNext,
    goToday,
    selectedKey,
    openFor,
    close,
    selectedPosts,
  }
}
