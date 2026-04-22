import { Navigate } from 'react-router-dom'
import { BookingReview } from '@/components/features/booking/BookingReview'
import { ExtrasForm } from '@/components/features/booking/ExtrasForm'
import { PassengerForm } from '@/components/features/booking/PassengerForm'
import { PriceSummary } from '@/components/features/booking/PriceSummary'
import { StepIndicator } from '@/components/features/booking/StepIndicator'
import {
  buildPassengerDescriptors,
  createEmptyPassengers,
} from '@/components/features/booking/booking-utils'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/empty-state'
import { Spinner } from '@/components/ui/spinner'
import { useFlight } from '@/hooks/useFlight'
import { useBookingStore } from '@/stores/bookingStore'
import { useSearchStore } from '@/stores/searchStore'

export function BookingPage() {
  const flightId = useBookingStore((state) => state.flightId)
  const passengers = useBookingStore((state) => state.passengers)
  const extras = useBookingStore((state) => state.extras)
  const step = useBookingStore((state) => state.step)
  const setPassengers = useBookingStore((state) => state.setPassengers)
  const setExtras = useBookingStore((state) => state.setExtras)
  const setStep = useBookingStore((state) => state.setStep)
  const searchParams = useSearchStore((state) => state.params)
  const travelerAdults = searchParams?.passengers.adults ?? 1
  const travelerChildren = searchParams?.passengers.children ?? 0
  const travelerCount = travelerAdults + travelerChildren
  const descriptors = buildPassengerDescriptors(travelerAdults, travelerChildren)
  const initialPassengers =
    passengers.length === descriptors.length
      ? passengers
      : createEmptyPassengers(descriptors)
  const { data: flight, isLoading } = useFlight(flightId ?? '')

  if (!flightId) {
    return <Navigate to="/search" replace />
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Loading booking flow" />
        </div>
      </AppShell>
    )
  }

  if (!flight) {
    return (
      <AppShell>
        <EmptyState
          title="Booking unavailable"
          description="The selected flight could not be loaded. Return to search and pick another itinerary."
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6 pb-24 lg:pb-0">
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            Booking Flow
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-stone-100">
            Complete your booking
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {flight.outbound[0]!.departureAirport.iata} to {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.iata} · {travelerCount} travelers
          </p>
        </section>

        <StepIndicator currentStep={step} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            {step === 0 ? (
              <PassengerForm
                descriptors={descriptors}
                initialPassengers={initialPassengers}
                onSubmit={(nextPassengers) => {
                  setPassengers(nextPassengers)
                  setStep(1)
                }}
              />
            ) : null}

            {step === 1 ? (
              <ExtrasForm
                flight={flight}
                passengers={descriptors}
                extras={extras}
                onChange={setExtras}
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
              />
            ) : null}

            {step === 2 ? (
              <BookingReview
                flight={flight}
                passengers={passengers}
                descriptors={descriptors}
                extras={extras}
                onBack={() => setStep(1)}
              />
            ) : null}
          </section>

          <aside>
            <PriceSummary
              flight={flight}
              extras={extras}
              travelerCount={travelerCount}
            />
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
