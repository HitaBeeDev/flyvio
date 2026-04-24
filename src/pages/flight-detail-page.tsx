import { useEffect } from 'react'
import { ArrowLeft, Bookmark, BookmarkCheck, ChevronRight, Plane } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AirlineInfo } from '@/components/features/flight-detail/AirlineInfo'
import { FareBreakdown } from '@/components/features/flight-detail/FareBreakdown'
import { FlightTimeline } from '@/components/features/flight-detail/FlightTimeline'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useFlight } from '@/hooks/useFlight'
import { formatPrice } from '@/lib/formatters'
import { useBookingStore } from '@/stores/bookingStore'
import { useSearchStore } from '@/stores/searchStore'
import { useUiStore } from '@/stores/uiStore'

function getTravelerCounts() {
  const params = useSearchStore.getState().params

  return {
    adults: params?.passengers?.adults ?? 1,
    children: params?.passengers?.children ?? 0,
  }
}

function FlightDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton variant="text" className="w-40" />
        <Skeleton className="h-11 w-80" />
        <Skeleton variant="text" className="w-56" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-slate-800/80 dark:bg-slate-950/75"
            >
              <div className="space-y-4">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-32 w-full rounded-[1.25rem]" />
                <Skeleton className="h-24 w-full rounded-[1.25rem]" />
              </div>
            </div>
          ))}
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-slate-800/80 dark:bg-slate-950/75">
            <div className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-40 w-full rounded-[1.25rem]" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-slate-800/80 dark:bg-slate-950/75">
            <div className="space-y-4">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-48 w-full rounded-[1.25rem]" />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-slate-800/80 dark:bg-slate-950/75">
            <div className="space-y-3">
              <Skeleton className="h-7 w-32" />
              <Skeleton variant="text" className="w-40" />
              <Skeleton className="h-11 w-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FlightDetailPage() {
  const navigate = useNavigate()
  const { flightId } = useParams<{ flightId: string }>()
  const resolvedFlightId = flightId ?? ''
  const { adults, children } = getTravelerCounts()
  const { data: flight, isLoading, isError } = useFlight(resolvedFlightId)
  const savedFlightIds = useUiStore((state) => state.savedFlightIds)
  const toggleSavedFlightId = useUiStore((state) => state.toggleSavedFlightId)
  const setFlight = useBookingStore((state) => state.setFlight)
  const setStep = useBookingStore((state) => state.setStep)
  const isSaved = savedFlightIds.includes(resolvedFlightId)

  useEffect(() => {
    if (!flight) {
      return
    }

    document.title = `${flight.outbound[0]!.departureAirport.iata} → ${flight.outbound[flight.outbound.length - 1]!.arrivalAirport.iata} · ${flight.airline.name} — SkyQuest`
  }, [flight])

  if (!flightId) {
    return <Navigate to="/search" replace />
  }

  if (isLoading) {
    return (
      <AppShell>
        <FlightDetailSkeleton />
      </AppShell>
    )
  }

  if (isError || !flight) {
    return (
      <AppShell>
        <EmptyState
          title="Flight not found"
          description="This flight is no longer available or the link may be outdated."
          ctaLabel="Back to search"
          onCtaClick={() => navigate('/search')}
          icon={<Plane className="size-12" />}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
            >
              <Link to="/search" className="transition hover:text-accent">
                Search Results
              </Link>
              <ChevronRight className="size-4" />
              <span>
                {flight.outbound[0]!.departureAirport.city} to{' '}
                {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
              </span>
            </nav>
            <Button asChild variant="ghost" size="sm" className="rounded-full px-0">
              <Link to="/search">
                <ArrowLeft className="size-4" />
                Back to results
              </Link>
            </Button>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-stone-100">
              {flight.outbound[0]!.departureAirport.city} to{' '}
              {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {flight.airline.name} · {flight.cabinClass} · {formatPrice(flight.price, 'USD')} per traveler
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleSavedFlightId(flight.id)}
            aria-label={isSaved ? 'Remove saved flight' : 'Save flight'}
            className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-accent hover:text-accent dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
          >
            {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <FlightTimeline title="Outbound" segments={flight.outbound} />
            {flight.isRoundTrip && flight.inbound ? (
              <FlightTimeline title="Inbound" segments={flight.inbound} />
            ) : null}
            <AirlineInfo flight={flight} />
          </div>

          <div className="space-y-6">
            <FareBreakdown
              pricePerTraveler={flight.price}
              adults={adults}
              children={children}
            />

            <Card className="border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/75">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
                  Book this flight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>Passenger details, extras, and booking review are now available in the next step.</p>
                <p>Chosen travelers: {adults + children}</p>
                <p>Total itinerary price: {formatPrice(flight.price * (adults + children), 'USD')}</p>
                <Button
                  className="mt-2 rounded-2xl"
                  onClick={() => {
                    setFlight(flight.id)
                    setStep(0)
                    navigate(`/booking/${flight.id}`)
                  }}
                >
                  Book this flight
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
