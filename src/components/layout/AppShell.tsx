import { useEffect, type ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { useUiStore } from '@/stores/uiStore'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.14),_transparent_34%),linear-gradient(180deg,_#fcfbf8_0%,_#f2ede3_100%)] text-slate-800 transition-colors dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_100%)] dark:text-stone-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Navbar />
        <main className="flex-1 py-8">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
