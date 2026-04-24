import { useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DestinationCard } from '@/components/features/explore/DestinationCard'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useDestinations } from '@/hooks/useDestinations'
import type { Destination } from '@/types'
import { cardItem, staggerContainer, ZERO_DURATION } from '@/lib/motion'

type ExploreRegion = 'all' | 'europe' | 'americas' | 'asia' | 'middle-east'

const REGION_TABS: Array<{ key: ExploreRegion; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'europe', label: 'Europe' },
  { key: 'americas', label: 'Americas' },
  { key: 'asia', label: 'Asia' },
  { key: 'middle-east', label: 'Middle East' },
]

function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-950/75">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton variant="text" className="w-24" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function normalizeRegion(rawRegion: string | null): ExploreRegion {
  if (rawRegion === 'europe') {
    return 'europe'
  }

  if (rawRegion === 'americas') {
    return 'americas'
  }

  if (rawRegion === 'asia') {
    return 'asia'
  }

  if (rawRegion === 'middle-east') {
    return 'middle-east'
  }

  return 'all'
}

function matchesRegion(destination: Destination, region: ExploreRegion) {
  if (region === 'all') {
    return true
  }

  if (region === 'americas') {
    return (
      destination.region === 'North America' ||
      destination.region === 'South America'
    )
  }

  if (region === 'middle-east') {
    return destination.region === 'Middle East'
  }

  if (region === 'europe') {
    return destination.region === 'Europe'
  }

  if (region === 'asia') {
    return destination.region === 'Asia'
  }

  return true
}

export function ExplorePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const destinationsQuery = useDestinations()
  const shouldReduceMotion = useReducedMotion()
  const motionTransition = shouldReduceMotion ? ZERO_DURATION : undefined
  const activeRegion = normalizeRegion(searchParams.get('region'))

  const filteredDestinations = useMemo(
    () =>
      (destinationsQuery.data ?? []).filter((destination) =>
        matchesRegion(destination, activeRegion),
      ),
    [activeRegion, destinationsQuery.data],
  )

  useEffect(() => {
    document.title = 'Explore Destinations — SkyQuest'
  }, [])

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-border/80 bg-white/75 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8 dark:bg-slate-950/70">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            Explore
          </p>
          <h1 className="mt-4 font-serif text-3xl text-slate-950 sm:text-4xl md:text-5xl dark:text-stone-50">
            Explore destinations worth the detour
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Filter curated city picks by region, compare starting fares, and jump into search from the places that fit the trip you want.
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          {REGION_TABS.map((tab) => {
            const active = tab.key === activeRegion

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setSearchParams((currentParams) => {
                    const nextParams = new URLSearchParams(currentParams)

                    if (tab.key === 'all') {
                      nextParams.delete('region')
                    } else {
                      nextParams.set('region', tab.key)
                    }

                    return nextParams
                  }, { replace: true })
                }}
                className={
                  active
                    ? 'min-h-[44px] rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(15,118,110,0.24)]'
                    : 'min-h-[44px] rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {destinationsQuery.isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 12 }, (_, index) => (
              <DestinationCardSkeleton key={index} />
            ))}
          </div>
        ) : destinationsQuery.isError ? (
          <EmptyState
            title="Could not load destinations"
            description="There was a problem fetching destinations. Check your connection and try again."
            ctaLabel="Try again"
            onCtaClick={() => void destinationsQuery.refetch()}
            icon={<Compass className="size-12" />}
          />
        ) : filteredDestinations.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={motionTransition}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {filteredDestinations.map((destination) => (
              <motion.div key={destination.id} variants={cardItem} transition={motionTransition}>
                <DestinationCard destination={destination} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No destinations in this region"
            description="Try another region filter or return to all destinations to keep exploring routes."
            ctaLabel="Show all destinations"
            onCtaClick={() => navigate('/explore')}
            icon={<Compass className="size-12" />}
          />
        )}
      </div>
    </AppShell>
  )
}
