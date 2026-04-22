import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { useUiStore } from '@/stores/uiStore'

function ThemeEffect() {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const resolvedTheme =
        theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme

      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
      document.documentElement.style.colorScheme = resolvedTheme
    }

    applyTheme()

    if (theme !== 'system') {
      return undefined
    }

    mediaQuery.addEventListener('change', applyTheme)

    return () => {
      mediaQuery.removeEventListener('change', applyTheme)
    }
  }, [theme])

  return null
}

function App() {
  return (
    <>
      <ThemeEffect />
      <Outlet />
      <Toaster />
    </>
  )
}

export default App
