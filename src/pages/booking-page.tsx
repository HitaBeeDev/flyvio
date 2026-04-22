import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Navigate, useParams } from 'react-router-dom'
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
import { Spinner } from '@/components/ui/spinner'
import { useFlight } from '@/hooks/useFlight'
import { useBookingStore } from '@/stores/bookingStore'
import { useSearchStore } from '@/stores/searchStore'

type StepDirection = 'forward' | 'backward'

export function BookingPage() {
  const { flightId: routeFlightId } = useParams<{ flightId: string }>()
  const shouldReduceMotion = useReducedMotion()
  const [stepDirection, setStepDirection] = useState<StepDirection>('forward')
  const flightId = useBookingStore((state) => state.flightId)
  const passengers = useBookingStore((state) => state.passengers)
  const extras = useBookingStore((state) => state.extras)
  const step = useBookingStore((state) => state.step)
  const setFlight = useBookingStore((state) => state.setFlight)
  const setPassengers = useBookingStore((state) => state.setPassengers)
  const setExtras = useBookingStore((state) => state.setExtras)
  const setStep = useBookingStore((state) => state.setStep)
  const reset = useBookingStore((state) => state.reset)
  const searchParams = useSearchStore((state) => state.params)
  const resolvedFlightId = routeFlightId ?? flightId ?? ''
  const travelerAdults = searchParams?.passengers?.adults ?? 1
  const travelerChildren = searchParams?.passengers?.children ?? 0
  const travelerCount = travelerAdults + travelerChildren
  const descriptors = buildPassengerDescriptors(travelerAdults, travelerChildren)
  const initialPassengers =
    passengers.length === descriptors.length
      ? passengers
      : createEmptyPassengers(descriptors)
  const { data: flight, isLoading } = useFlight(resolvedFlightId)

  useEffect(() => {
    if (!routeFlightId) {
      return
    }

    reset()
    setFlight(routeFlightId)
    setStep(0)
  }, [reset, routeFlightId, setFlight, setStep])

  useEffect(() => {
    document.title = 'Complete Your Booking — SkyQuest'
  }, [])

  useEffect(() => {
    if (step === 0) {
      return
    }

    window.history.pushState({ bookingStep: step }, '')

    const handlePopState = () => {
      const currentStep = useBookingStore.getState().step

      if (currentStep > 0) {
        const nextStep = (currentStep - 1) as 0 | 1 | 2
        useBookingStore.getState().setStep(nextStep)
        window.history.pushState({ bookingStep: nextStep }, '')
      }
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [step])

  useEffect(() => {
    if (step === 0) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [step])

  if (!resolvedFlightId) {
    return <Navigate to="/" replace />
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
    return <Navigate to="/" replace />
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
          <section className="min-w-0 overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={stepDirection}>
              <motion.div
                key={step}
                custom={stepDirection}
                variants={{
                  hidden: (dir: StepDirection) => ({
                    x: shouldReduceMotion ? 0 : dir === 'forward' ? 40 : -40,
                    opacity: 0,
                  }),
                  visible: {
                    x: 0,
                    opacity: 1,
                    transition: { duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' },
                  },
                  exit: (dir: StepDirection) => ({
                    x: shouldReduceMotion ? 0 : dir === 'forward' ? -40 : 40,
                    opacity: 0,
                    transition: { duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeIn' },
                  }),
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {step === 0 ? (
                  <PassengerForm
                    descriptors={descriptors}
                    initialPassengers={initialPassengers}
                    onSubmit={(nextPassengers) => {
                      setPassengers(nextPassengers)
                      setStepDirection('forward')
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
                    onBack={() => {
                      setStepDirection('backward')
                      setStep(0)
                    }}
                    onNext={() => {
                      setStepDirection('forward')
                      setStep(2)
                    }}
                  />
                ) : null}

                {step === 2 ? (
                  <BookingReview
                    flight={flight}
                    passengers={passengers}
                    descriptors={descriptors}
                    extras={extras}
                    onBack={() => {
                      setStepDirection('backward')
                      setStep(1)
                    }}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
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
