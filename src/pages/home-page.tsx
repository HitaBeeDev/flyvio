import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const scaffoldChecks = [
  'Vite + React + TypeScript baseline',
  'Tailwind CSS v4 via the Vite plugin',
  'Zustand dark mode toggling `html.dark`',
  'React Router and TanStack Query providers',
  'shadcn/ui primitives ready for feature work',
] as const

function loadScaffoldSummary() {
  return Promise.resolve({
    label: 'Phase 1 foundation ready',
    completion: 100,
  })
}

export function HomePage() {
  const summaryQuery = useQuery({
    queryKey: ['scaffold-summary'],
    queryFn: loadScaffoldSummary,
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="rounded-[2rem] border border-border/80 bg-surface/85 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.10)] backdrop-blur dark:bg-slate-950/70"
        >
          <Badge className="bg-accent text-white hover:bg-accent">Scaffold Reset</Badge>
          <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-none text-slate-950 dark:text-stone-50 sm:text-6xl">
            The project is back to a clean starter state.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Old feature code has been removed. What remains is a strict TypeScript
            React app with Tailwind v4, shadcn/ui, routing, query state, and theme
            state ready for the next phase.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {scaffoldChecks.map((item, index) => (
              <Card
                key={item}
                className="border-border/80 bg-white/75 dark:bg-slate-900/75"
              >
                <CardHeader>
                  <CardDescription>Checkpoint {index + 1}</CardDescription>
                  <CardTitle className="flex items-start gap-3 text-lg">
                    <CheckCircle2 className="mt-0.5 size-5 text-accent" />
                    <span>{item}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          <Card className="border-border/80 bg-white/80 dark:bg-slate-950/75">
            <CardHeader>
              <CardDescription>Query Wiring</CardDescription>
              <CardTitle>{summaryQuery.data?.label ?? 'Loading scaffold status'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={summaryQuery.data?.completion ?? 0} />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                QueryClient is mounted at the app root and ready for real data hooks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-white/80 dark:bg-slate-950/75">
            <CardHeader>
              <CardDescription>UI Baseline</CardDescription>
              <CardTitle>shadcn/ui is installed and usable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full justify-between bg-accent text-white hover:bg-accent/90">
                    Open starter dialog
                    <ArrowRight className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Starter shell is working</DialogTitle>
                    <DialogDescription>
                      This confirms the baseline app can render shadcn components on top of Tailwind v4.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input readOnly value="Ready for Phase 2 feature work" />
                    <Separator />
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Keep new styling in TSX class strings. `src/index.css` stays token-only.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.aside>
      </div>
    </AppShell>
  )
}
