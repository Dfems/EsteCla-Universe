import { useEffect } from 'react'

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = () => {
  useEffect(() => {
    const handleInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      const button = document.getElementById('install-button')
      if (button) {
        button.style.display = 'block'
        button.onclick = () => e.prompt()
      }
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
  }, [])
}
