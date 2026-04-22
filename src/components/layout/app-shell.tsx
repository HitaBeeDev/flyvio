import type { ReactNode } from 'react'
import { Monitor, MoonStar, SunMedium } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUiStore, type ThemeMode } from '@/stores/uiStore'

type AppShellProps = {
  children: ReactNode
}

const themeOptions: Array<{
  value: ThemeMode
  label: string
  icon: typeof SunMedium
}> = [
  { value: 'light', label: 'Light mode', icon: SunMedium },
  { value: 'dark', label: 'Dark mode', icon: MoonStar },
  { value: 'system', label: 'System theme', icon: Monitor },
]

export function AppShell({ children }: AppShellProps) {
  const theme = useUiStore((state) => state.theme)
  const setTheme = useUiStore((state) => state.setTheme)
  const activeTheme =
    themeOptions.find((option) => option.value === theme) ?? themeOptions[themeOptions.length - 1]!
  const ActiveThemeIcon = activeTheme.icon

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                aria-label="Change theme"
                className="gap-2 border-border/80 bg-white/70 text-slate-900 dark:bg-slate-900/70 dark:text-stone-100"
              >
                <ActiveThemeIcon className="size-4" />
                {activeTheme.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as ThemeMode)}
              >
                {themeOptions.map((option) => {
                  const Icon = option.icon

                  return (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      <Icon className="size-4" />
                      {option.label}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 py-8">{children}</main>
      </div>
    </div>
  )
}
