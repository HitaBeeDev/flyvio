import type { ReactNode } from 'react'
import { MoonStar, SunMedium } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { theme, toggleTheme } = useThemeStore()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.14),_transparent_34%),linear-gradient(180deg,_#fcfbf8_0%,_#f2ede3_100%)] text-slate-800 transition-colors dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_100%)] dark:text-stone-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-border/80 pb-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
              SkyQuest
            </p>
            <h1 className="mt-2 font-serif text-4xl text-slate-950 dark:text-stone-50">
              Fresh React foundation
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            className="gap-2 border-border/80 bg-white/70 text-slate-900 dark:bg-slate-900/70 dark:text-stone-100"
          >
            {nextTheme === 'dark' ? <MoonStar className="size-4" /> : <SunMedium className="size-4" />}
            {nextTheme === 'dark' ? 'Dark mode' : 'Light mode'}
          </Button>
        </header>

        <main className="flex-1 py-8">{children}</main>
      </div>
    </div>
  )
}
