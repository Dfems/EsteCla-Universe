import { useEffect, useState } from 'react'

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
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('📦 PWA install prompt available')
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) {
      console.warn('Install prompt not available')
      return
    }

    try {
      console.log('🚀 Starting install process...')
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted installation')
        // Pulizia post-installazione
        setInstallPrompt(null)
        setIsInstallable(false)
      } else {
        console.log('❌ User dismissed installation')
      }
    } catch (error) {
      console.error('🔥 Install error:', error)
    }
  }

  const isIOS = () => {
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
        navigator.platform
      ) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    )
  }

  const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  }

  const showIOSInstallPrompt = () => {
    alert(
      'Per installare l\'app:\n1. Tocca il pulsante "Condividi"\n2. Seleziona "Aggiungi a Home"'
    )
  }

  return {
    isInstallable,
    handleInstall,
    isIOS: isIOS() && isSafari(),
    showIOSInstallPrompt,
  }
}
