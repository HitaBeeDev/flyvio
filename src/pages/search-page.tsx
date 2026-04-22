import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
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
import { DEFAULT_FILTERS, useSearchStore } from '@/stores/searchStore'
import type { SearchParams, SortOption } from '@/types'

function getSearchParamsFromUrl(searchParams: URLSearchParams): SearchParams | null {
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const departureDate = searchParams.get('departureDate')

  if (!origin || !destination || !departureDate) {
    return null
  }

  return {
    origin,
    destination,
    departureDate,
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

const resultsListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
}

export function SearchPage() {
  const [urlParams, setUrlParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const storedParams = useSearchStore((state) => state.params)
  const filters = useSearchStore((state) => state.filters)
  const sort = useSearchStore((state) => state.sort)
  const setFilters = useSearchStore((state) => state.setFilters)
  const setSort = useSearchStore((state) => state.setSort)
  const resetFilters = useSearchStore((state) => state.resetFilters)
  const resolvedParams = useMemo(
    () => getSearchParamsFromUrl(urlParams) ?? storedParams,
    [storedParams, urlParams],
  )

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

  const { data: flights = [], isLoading } = useFlights(resolvedParams)

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

  if (!resolvedParams) {
    return (
      <AppShell>
        <EmptyState
          title="Start with a route"
          description="Choose an origin, destination, and travel dates to see available flights."
          icon={<Plane className="size-12" />}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <ResultsSummary params={resolvedParams} />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
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

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <FlightCardSkeleton key={index} />
                ))}
              </div>
            ) : visibleFlights.length > 0 ? (
              <motion.div
                variants={resultsListVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {visibleFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </motion.div>
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
        <DrawerContent className="px-2 pb-6 pt-2 xl:hidden">
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
