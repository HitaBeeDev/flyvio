import { useMemo } from 'react'
import { Luggage, Sofa } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { BookingExtras, Flight } from '@/types'
import {
  EXTRA_BAGGAGE_PRICE,
  getFlightSegmentsWithKeys,
  getSeatType,
  isSeatUnavailable,
  type PassengerDescriptor,
} from './booking-utils'

type ExtrasFormProps = {
  flight: Flight
  passengers: PassengerDescriptor[]
  extras: BookingExtras
  onChange: (extras: BookingExtras) => void
  onBack: () => void
  onNext: () => void
}

const seatColumns = ['A', 'B', 'C', 'D', 'E', 'F'] as const

export function ExtrasForm({
  flight,
  passengers,
  extras,
  onChange,
  onBack,
  onNext,
}: ExtrasFormProps) {
  const segments = useMemo(() => getFlightSegmentsWithKeys(flight), [flight])

  const toggleBaggage = (passengerKey: string) => {
    onChange({
      ...extras,
      extraBaggage: extras.extraBaggage.includes(passengerKey)
        ? extras.extraBaggage.filter((value) => value !== passengerKey)
        : [...extras.extraBaggage, passengerKey],
    })
  }

  const toggleSeat = (passengerKey: string, segmentKey: string, seatCode: string) => {
    const occupiedByAnotherPassenger = extras.selectedSeats.some(
      (selection) =>
        selection.flightSegmentId === segmentKey &&
        selection.seatCode === seatCode &&
        selection.passengerKey !== passengerKey,
    )

    if (occupiedByAnotherPassenger || isSeatUnavailable(segmentKey, seatCode)) {
      return
    }

    const existingSelection = extras.selectedSeats.find(
      (selection) =>
        selection.passengerKey === passengerKey &&
        selection.flightSegmentId === segmentKey,
    )

    if (existingSelection?.seatCode === seatCode) {
      onChange({
        ...extras,
        selectedSeats: extras.selectedSeats.filter(
          (selection) =>
            !(
              selection.passengerKey === passengerKey &&
              selection.flightSegmentId === segmentKey &&
              selection.seatCode === seatCode
            ),
        ),
      })
      return
    }

    onChange({
      ...extras,
      selectedSeats: [
        ...extras.selectedSeats.filter(
          (selection) =>
            !(
              selection.passengerKey === passengerKey &&
              selection.flightSegmentId === segmentKey
            ),
        ),
        {
          passengerKey,
          flightSegmentId: segmentKey,
          seatCode,
          seatType: getSeatType(seatCode),
        },
      ],
    })
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-950/75">
        <div className="mb-5 flex items-center gap-3">
          <Luggage className="size-5 text-accent" />
          <div>
            <p className="text-lg font-semibold text-slate-950 dark:text-stone-100">
              Extra baggage
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Add 23kg bag for ${EXTRA_BAGGAGE_PRICE} per traveler.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {passengers.map((passenger) => (
            <label
              key={passenger.key}
              className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-slate-200/80 px-4 py-3 dark:border-slate-800/80"
            >
              <div>
                <p className="font-medium text-slate-950 dark:text-stone-100">{passenger.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add 23kg bag - $35
                </p>
              </div>
              <Checkbox
                checked={extras.extraBaggage.includes(passenger.key)}
                onCheckedChange={() => toggleBaggage(passenger.key)}
              />
            </label>
          ))}
        </div>
      </section>

      {segments.map((segment) => (
        <section
          key={segment.key}
          className="rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-950/75"
        >
          <div className="mb-5 flex items-center gap-3">
            <Sofa className="size-5 text-accent" />
            <div>
              <p className="text-lg font-semibold text-slate-950 dark:text-stone-100">
                {segment.label} seat selection
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {segment.segment.departureAirport.iata} to {segment.segment.arrivalAirport.iata}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {passengers.map((passenger) => (
              <div key={`${segment.key}-${passenger.key}`} className="space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {passenger.label}
                </p>
                <div className="overflow-x-auto">
                  <div className="grid min-w-[264px] gap-2">
                  {Array.from({ length: 3 }, (_, rowIndex) => {
                    const rowNumber = rowIndex + 1

                    return (
                      <div key={rowNumber} className="grid grid-cols-6 gap-2">
                        {seatColumns.map((column) => {
                          const seatCode = `${rowNumber}${column}`
                          const selectedByPassenger = extras.selectedSeats.some(
                            (selection) =>
                              selection.passengerKey === passenger.key &&
                              selection.flightSegmentId === segment.key &&
                              selection.seatCode === seatCode,
                          )
                          const selectedByAnotherPassenger = extras.selectedSeats.some(
                            (selection) =>
                              selection.passengerKey !== passenger.key &&
                              selection.flightSegmentId === segment.key &&
                              selection.seatCode === seatCode,
                          )
                          const unavailable = isSeatUnavailable(segment.key, seatCode)

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              onClick={() => toggleSeat(passenger.key, segment.key, seatCode)}
                              disabled={unavailable || selectedByAnotherPassenger}
                              className={cn(
                                'min-h-[44px] rounded-xl border px-0 py-3 text-sm font-medium transition',
                                selectedByPassenger
                                  ? 'border-accent bg-accent text-white'
                                  : unavailable || selectedByAnotherPassenger
                                    ? 'border-slate-200 bg-slate-200 text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-500'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-accent/50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200',
                              )}
                            >
                              {seatCode}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" className="rounded-2xl" onClick={onBack}>
          Back
        </Button>
        <Button type="button" className="rounded-2xl" onClick={onNext}>
          Review booking
        </Button>
      </div>
    </div>
  )
}
