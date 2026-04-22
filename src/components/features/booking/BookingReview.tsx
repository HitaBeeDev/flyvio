import { useCreateBooking } from '@/hooks/useCreateBooking'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatTime } from '@/lib/formatters'
import type { BookingExtras, Flight, Passenger } from '@/types'
import {
  calculateBookingPrice,
  formatMoney,
  formatSeatSummary,
  type PassengerDescriptor,
} from './booking-utils'

type BookingReviewProps = {
  flight: Flight
  passengers: Passenger[]
  descriptors: PassengerDescriptor[]
  extras: BookingExtras
  onBack: () => void
}

export function BookingReview({
  flight,
  passengers,
  descriptors,
  extras,
  onBack,
}: BookingReviewProps) {
  const createBooking = useCreateBooking()
  const price = calculateBookingPrice(flight, extras, passengers.length)

  return (
    <div className="space-y-5">
      <Card className="border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/75">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
            Flight summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {flight.outbound[0]!.departureAirport.city} ({flight.outbound[0]!.departureAirport.iata}) to{' '}
            {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city} ({flight.outbound[flight.outbound.length - 1]!.arrivalAirport.iata})
          </p>
          <p>
            Departure {formatDate(flight.outbound[0]!.departureTime)} at {formatTime(flight.outbound[0]!.departureTime)}
          </p>
          <p>
            Airline {flight.airline.name} · {flight.cabinClass}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/75">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
            Passenger list
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {passengers.map((passenger, index) => (
            <div key={`${passenger.firstName}-${passenger.passportNumber}-${index}`} className="rounded-[1.2rem] border border-slate-200/80 px-4 py-4 text-sm dark:border-slate-800/80">
              <p className="font-medium text-slate-950 dark:text-stone-100">
                {passenger.firstName} {passenger.lastName}
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Passport {passenger.passportNumber} · {passenger.nationality}
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Seats {formatSeatSummary(extras.selectedSeats, descriptors[index]!.key)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/75">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
            Extras and total
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>Flight subtotal: {formatMoney(price.flightSubtotal)}</p>
          <p>Extra baggage: {formatMoney(price.baggageSubtotal)}</p>
          <p>Seat selection: {formatMoney(price.seatSubtotal)}</p>
          <p>Extra baggage selections: {extras.extraBaggage.length}</p>
          <p>Seat selections: {extras.selectedSeats.length}</p>
          <p>Total due: {formatMoney(price.total)}</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" className="rounded-2xl" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          className="rounded-2xl"
          loading={createBooking.isPending}
          onClick={() =>
            createBooking.mutate({
              flightId: flight.id,
              cabinClass: flight.cabinClass,
              isRoundTrip: flight.isRoundTrip,
              passengers,
              extras,
            })
          }
        >
          Confirm & Book
        </Button>
      </div>
    </div>
  )
}
