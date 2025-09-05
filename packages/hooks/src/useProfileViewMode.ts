import { useEffect, useState } from 'react'

export type ProfileViewMode = 'grid' | 'list'

const STORAGE_KEY = 'profile:viewMode'

export function useProfileViewMode(defaultMode: ProfileViewMode = 'grid') {
  const [viewMode, setViewMode] = useState<ProfileViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'grid' || saved === 'list') return saved
    } catch {
      // ignore
    }
    return defaultMode
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, viewMode)
    } catch {
      // ignore
    }
  }, [viewMode])

  const setGrid = () => setViewMode('grid')
  const setList = () => setViewMode('list')

  return { viewMode, setGrid, setList }
}
