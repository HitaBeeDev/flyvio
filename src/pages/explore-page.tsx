import { Compass, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const destinations = [
  'Tokyo',
  'Lisbon',
  'Cape Town',
] as const

export function ExplorePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-border/80 bg-white/75 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.10)] backdrop-blur dark:bg-slate-950/70">
          <Badge className="bg-accent text-white hover:bg-accent">Explore</Badge>
          <h1 className="mt-4 font-serif text-5xl text-slate-950 dark:text-stone-50">
            Discover routes worth building next.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            This placeholder route keeps the layout navigation real while feature work for the explore experience is still in progress.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {destinations.map((city) => (
            <Card key={city} className="border-border/80 bg-white/80 dark:bg-slate-950/75">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Compass className="size-4" />
                  Upcoming destination
                </CardDescription>
                <CardTitle>{city}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Curated visuals, pricing, and destination filters will land here in the next feature pass.
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/80 bg-white/80 dark:bg-slate-950/75">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Layout checkpoint
            </CardDescription>
            <CardTitle>Navigation, shell, and footer are now wired.</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </AppShell>
  )
}
