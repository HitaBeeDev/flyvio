import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { useThemeStore } from './stores/theme'

function App() {
  const [count, setCount] = useState(0)
  const { theme, toggleTheme } = useThemeStore()

  const cardClassName =
    'rounded-[2rem] border border-border/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(25,33,52,0.08)] backdrop-blur dark:bg-slate-950/80 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]'

  const actionClassName =
    'inline-flex items-center gap-3 rounded-full border border-border/80 bg-stone-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:border-accent hover:text-accent dark:bg-slate-900 dark:text-stone-100'

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_30%),linear-gradient(180deg,_#fcfbf8_0%,_#f1ede3_100%)] font-sans text-slate-700 transition-colors dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#111827_100%)] dark:text-slate-300">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-surface/85 shadow-[0_30px_120px_rgba(15,23,42,0.10)] backdrop-blur dark:bg-slate-950/70">
          <header className="flex items-center justify-between border-b border-border/80 px-5 py-4 sm:px-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
                SkyQuest
              </p>
              <h1 className="font-serif text-3xl text-slate-950 dark:text-stone-50 sm:text-4xl">
                Tailwind v4 starter
              </h1>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-accent hover:text-accent dark:bg-slate-900/80 dark:text-stone-100"
            >
              <span className="font-mono text-xs uppercase tracking-[0.25em]">
                Theme
              </span>
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          </header>

          <section className="grid flex-1 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:py-10">
            <div className="flex flex-col justify-center gap-8">
              <div className="space-y-5">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
                  React + Vite
                </p>
                <div className="space-y-4">
                  <h2 className="max-w-2xl font-serif text-5xl leading-none text-slate-950 dark:text-stone-50 sm:text-6xl">
                    Component styling now lives directly in TSX.
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    Tailwind CSS v4 is wired through Vite, design tokens live in
                    <code className="mx-1 rounded bg-black/5 px-2 py-1 font-mono text-sm dark:bg-white/10">
                      src/index.css
                    </code>
                    , and dark mode is controlled by a Zustand store that toggles
                    the
                    <code className="mx-1 rounded bg-black/5 px-2 py-1 font-mono text-sm dark:bg-white/10">
                      html.dark
                    </code>
                    class.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  className={actionClassName}
                  href="https://tailwindcss.com/docs/installation/using-vite"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tailwind docs
                </a>
                <a
                  className={actionClassName}
                  href="https://zustand.docs.pmnd.rs/getting-started/introduction"
                  target="_blank"
                  rel="noreferrer"
                >
                  Zustand docs
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <article className={cardClassName}>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                    Tokens
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    Custom accent, surface, border, font, and spacing values are
                    exposed through the v4 theme block.
                  </p>
                </article>
                <article className={cardClassName}>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                    Utilities
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    No CSS modules, no extracted utility composition, and no
                    custom component layers.
                  </p>
                </article>
                <article className={cardClassName}>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                    Mode
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    Theme preference persists in local storage and initializes
                    before React renders.
                  </p>
                </article>
              </div>
            </div>

            <aside className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border border-border/80 bg-slate-950 px-6 py-6 text-stone-100 shadow-[0_30px_120px_rgba(2,6,23,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.32),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.18),_transparent_26%)]" />
              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-300">
                  Preview
                </p>
                <div className="relative mx-auto mt-6 h-56 w-full max-w-xs">
                  <img
                    src={heroImg}
                    className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2"
                    width="170"
                    height="179"
                    alt=""
                  />
                  <img
                    src={reactLogo}
                    className="absolute left-1/2 top-[4.75rem] h-8 -translate-x-1/2 [transform:translateX(-50%)_perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]"
                    alt="React logo"
                  />
                  <img
                    src={viteLogo}
                    className="absolute left-1/2 top-[8.75rem] h-7 w-auto -translate-x-1/2 [transform:translateX(-50%)_perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]"
                    alt="Vite logo"
                  />
                </div>
              </div>

              <div className="relative space-y-4 rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="font-serif text-2xl">Counter</p>
                <p className="text-sm leading-6 text-stone-300">
                  Utility classes replace the former stylesheet-driven button
                  styling.
                </p>
                <button
                  type="button"
                  onClick={() => setCount((currentCount) => currentCount + 1)}
                  className="inline-flex items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/12 px-5 py-3 font-mono text-sm uppercase tracking-[0.22em] text-teal-100 transition hover:border-teal-300 hover:bg-teal-300/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
                >
                  Count is {count}
                </button>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
