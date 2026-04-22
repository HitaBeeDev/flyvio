import { ArrowLeft, Plane } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AirlineInfo } from '@/components/features/flight-detail/AirlineInfo'
import { FareBreakdown } from '@/components/features/flight-detail/FareBreakdown'
import { FlightTimeline } from '@/components/features/flight-detail/FlightTimeline'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Spinner } from '@/components/ui/spinner'
import { useFlight } from '@/hooks/useFlight'
import { formatPrice } from '@/lib/formatters'
import { useBookingStore } from '@/stores/bookingStore'
import { useSearchStore } from '@/stores/searchStore'

function getTravelerCounts() {
  const params = useSearchStore.getState().params

  return {
    adults: params?.passengers.adults ?? 1,
    children: params?.passengers.children ?? 0,
  }
}

export function FlightDetailPage() {
  const { flightId } = useParams<{ flightId: string }>()
  const resolvedFlightId = flightId ?? ''
  const { adults, children } = getTravelerCounts()
  const { data: flight, isLoading, isError } = useFlight(resolvedFlightId)
  const setStep = useBookingStore((state) => state.setStep)

  if (!flightId) {
    return <Navigate to="/search" replace />
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Loading flight details" />
        </div>
      </AppShell>
    )
  }

  if (isError || !flight) {
    return (
      <AppShell>
        <EmptyState
          title="Flight details unavailable"
          description="This itinerary could not be found. Return to search results and choose another option."
          icon={<Plane className="size-12" />}
          ctaLabel="Back to search"
          onCtaClick={() => {
            window.location.href = '/search'
          }}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
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
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
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
                  Next step
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>Passenger details, extras, and booking review are now available in the next step.</p>
                <p>Chosen travelers: {adults + children}</p>
                <p>Total itinerary price: {formatPrice(flight.price * (adults + children), 'USD')}</p>
                <Button asChild className="mt-2 rounded-2xl" onClick={() => setStep(0)}>
                  <Link to="/booking">Continue to booking</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
