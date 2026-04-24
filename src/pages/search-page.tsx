import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { FilterPanel } from '@/components/features/results/FilterPanel'
import { FlightCard } from '@/components/features/results/FlightCard'
import { FlightCardSkeleton } from '@/components/features/results/FlightCardSkeleton'
import { ResultsSummary } from '@/components/features/results/ResultsSummary'
import { SortBar } from '@/components/features/results/SortBar'
import {
  filterFlights,
  getAirlineCounts,
  getDurationBounds,
  getPriceBounds,
  parseFilters,
  formatSearchPageTitle,
  serializeFilters,
  serializeSort,
  sortFlights,
} from '@/components/features/results/results-utils'
import { AppShell } from '@/components/layout/AppShell'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { EmptyState } from '@/components/ui/empty-state'
import { useFlights } from '@/hooks/useFlights'
import { useBookingStore } from '@/stores/bookingStore'
import { DEFAULT_FILTERS, useSearchStore } from '@/stores/searchStore'
import type { SearchParams, SortOption } from '@/types'
import { staggerContainer, ZERO_DURATION } from '@/lib/motion'

function getSearchParamsFromUrl(searchParams: URLSearchParams): Partial<SearchParams> | null {
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const departureDate = searchParams.get('departureDate')

  if (!origin && !destination && !departureDate) {
    return null
  }

  return {
    origin: origin ?? undefined,
    destination: destination ?? undefined,
    departureDate: departureDate ?? undefined,
    returnDate: searchParams.get('returnDate') ?? undefined,
    passengers: {
      adults: Number(searchParams.get('adults') ?? '1'),
      children: Number(searchParams.get('children') ?? '0'),
      infants: Number(searchParams.get('infants') ?? '0'),
    },
    cabinClass: (searchParams.get('cabinClass') as SearchParams['cabinClass']) ?? 'Economy',
    isRoundTrip: (searchParams.get('trip') ?? 'round-trip') === 'round-trip',
  }
}

export function SearchPage() {
  const navigate = useNavigate()
  const [urlParams, setUrlParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleState, setVisibleState] = useState({ key: '', count: 20 })
  const filters = useSearchStore((state) => state.filters)
  const sort = useSearchStore((state) => state.sort)
  const setFilters = useSearchStore((state) => state.setFilters)
  const setSort = useSearchStore((state) => state.setSort)
  const resetFilters = useSearchStore((state) => state.resetFilters)
  const setFlight = useBookingStore((state) => state.setFlight)
  const hasUrlParams = urlParams.toString().length > 0
  const resolvedParams = useMemo(() => getSearchParamsFromUrl(urlParams), [urlParams])
  const summaryParams = resolvedParams ?? {}
  const validSearchParams = useMemo(() => {
    if (
      !resolvedParams?.origin ||
      !resolvedParams.destination ||
      !resolvedParams.departureDate ||
      !resolvedParams.passengers ||
      !resolvedParams.cabinClass ||
      typeof resolvedParams.isRoundTrip !== 'boolean'
    ) {
      return null
    }

    return resolvedParams as SearchParams
  }, [resolvedParams])

  const parsedFilters = useMemo(
    () => parseFilters(urlParams, DEFAULT_FILTERS),
    [urlParams],
  )
  const parsedSort = useMemo(
    () => (urlParams.get('sort') as SortOption | null) ?? 'best',
    [urlParams],
  )

  useEffect(() => {
    setFilters(parsedFilters)
    setSort(parsedSort)
  }, [parsedFilters, parsedSort, setFilters, setSort])

  useEffect(() => {
    setUrlParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams)

        ;['price', 'stops', 'depart', 'airlines', 'maxDuration', 'sort'].forEach((key) => {
          nextParams.delete(key)
        })

        const serializedFilters = serializeFilters(filters, DEFAULT_FILTERS)

        serializedFilters.forEach((value, key) => {
          nextParams.set(key, value)
        })

        const serializedSort = serializeSort(sort, 'best')

        if (serializedSort) {
          nextParams.set('sort', serializedSort)
        }

        if (nextParams.toString() === currentParams.toString()) {
          return currentParams
        }

        return nextParams
      },
      { replace: true },
    )
  }, [filters, setUrlParams, sort])

  const shouldReduceMotion = useReducedMotion()
  const motionTransition = shouldReduceMotion ? ZERO_DURATION : undefined
  const { data: flights = [], isLoading } = useFlights(validSearchParams)

  const airlineOptions = useMemo(
    () =>
      Object.values(getAirlineCounts(flights)).sort(
        (left, right) => right.count - left.count || left.name.localeCompare(right.name),
      ),
    [flights],
  )
  const priceBounds = useMemo(() => getPriceBounds(flights), [flights])
  const durationBounds = useMemo(() => getDurationBounds(flights), [flights])
  const priceSliderBounds = useMemo<[number, number]>(
    () => [
      Math.min(priceBounds[0], filters.priceRange[0]),
      Math.max(priceBounds[1], filters.priceRange[1]),
    ],
    [filters.priceRange, priceBounds],
  )
  const durationSliderBounds = useMemo<[number, number]>(
    () => [
      Math.min(durationBounds[0], filters.maxDuration),
      Math.max(durationBounds[1], filters.maxDuration),
    ],
    [durationBounds, filters.maxDuration],
  )
  const visibleFlights = useMemo(
    () => sortFlights(filterFlights(flights, filters), sort),
    [filters, flights, sort],
  )
  const resultsStateKey = useMemo(
    () =>
      JSON.stringify({
        params: validSearchParams,
        filters,
        sort,
      }),
    [filters, sort, validSearchParams],
  )
  const visibleCount =
    visibleState.key === resultsStateKey ? visibleState.count : 20
  const paginatedFlights = useMemo(
    () => visibleFlights.slice(0, visibleCount),
    [visibleCount, visibleFlights],
  )

  useEffect(() => {
    document.title =
      validSearchParams == null
        ? 'Search Flights — SkyQuest'
        : formatSearchPageTitle(validSearchParams)
  }, [validSearchParams])

  if (!hasUrlParams) {
    return <Navigate to="/" replace />
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <ResultsSummary params={summaryParams} />

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                priceBounds={priceSliderBounds}
                durationBounds={durationSliderBounds}
                airlines={airlineOptions}
              />
            </div>
          </aside>

          <section className="space-y-5">
            <SortBar
              sort={sort}
              resultCount={visibleFlights.length}
              onSortChange={setSort}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />

            {validSearchParams == null ? (
              <EmptyState
                title="Finish your search"
                description="Choose an origin and departure date to see live route options for this destination."
                icon={<Plane className="size-12" />}
              />
            ) : isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, index) => (
                  <FlightCardSkeleton key={index} />
                ))}
              </div>
            ) : visibleFlights.length > 0 ? (
              <div className="space-y-5">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  transition={motionTransition}
                  className="space-y-4"
                >
                  {paginatedFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={(selectedFlight) => {
                        setFlight(selectedFlight.id)
                        navigate(`/flights/${selectedFlight.id}`)
                      }}
                    />
                  ))}
                </motion.div>

                {visibleCount < visibleFlights.length ? (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleState({
                          key: resultsStateKey,
                          count: visibleCount + 20,
                        })
                      }
                      className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-accent hover:text-accent dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                      Load more
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="No flights match these filters"
                description="Try widening the price range, clearing airline constraints, or resetting filters to see more options."
                ctaLabel="Reset filters"
                onCtaClick={resetFilters}
                icon={<Plane className="size-12" />}
              />
            )}
          </section>
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DrawerContent className="px-2 pb-6 pt-2 lg:hidden">
          <DrawerHeader className="px-4">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>
              Refine results by price, stops, departure windows, airline, and duration.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-2">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              priceBounds={priceSliderBounds}
              durationBounds={durationSliderBounds}
              airlines={airlineOptions}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </AppShell>
  )
}
