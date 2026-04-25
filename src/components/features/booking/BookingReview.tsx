import { Plane } from "lucide-react";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/formatters";
import { BOOKING_COPY } from "@/lib/constants";
import { useBookingStore } from "@/stores/bookingStore";
import type { Flight } from "@/types";
import {
  calculateBookingPrice,
  formatMoney,
  formatSeatSummary,
  type PassengerDescriptor,
} from "./booking-utils";

type BookingReviewProps = {
  flight: Flight;
  descriptors: PassengerDescriptor[];
};

export function BookingReview({ flight, descriptors }: BookingReviewProps) {
  const createBooking = useCreateBooking();
  const passengers = useBookingStore((state) => state.passengers);
  const extras = useBookingStore((state) => state.extras);
  const setStep = useBookingStore((state) => state.setStep);
  const price = calculateBookingPrice(flight, extras, passengers.length);

  const firstSegment = flight.outbound[0]!;
  const lastSegment = flight.outbound[flight.outbound.length - 1]!;

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
        <div className="border-b border-indigo-100 px-5 py-3.5 dark:border-indigo-800">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
            {BOOKING_COPY.review.flightSummaryTitle}
          </p>
        </div>
        <div className="px-5 py-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="min-w-0">
              <p className="font-mono text-2xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
                {firstSegment.departureAirport.iata}
              </p>
              <p className="mt-0.5 truncate text-xs text-indigo-400 dark:text-indigo-500">
                {firstSegment.departureAirport.city}
              </p>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-px flex-1 bg-indigo-200 dark:bg-indigo-800" />
              <Plane className="size-4 shrink-0 -rotate-90 text-accent" />
              <div className="h-px flex-1 bg-indigo-200 dark:bg-indigo-800" />
            </div>
            <div className="min-w-0 text-right">
              <p className="font-mono text-2xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
                {lastSegment.arrivalAirport.iata}
              </p>
              <p className="mt-0.5 truncate text-xs text-indigo-400 dark:text-indigo-500">
                {lastSegment.arrivalAirport.city}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-0 border-t border-indigo-100 pt-4 dark:border-indigo-800">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
                {BOOKING_COPY.review.departurePrefix}
              </p>
              <p className="mt-1 text-sm font-medium text-indigo-950 dark:text-indigo-50">
                {formatDate(firstSegment.departureTime)}
              </p>
              <p className="font-mono text-sm text-indigo-500 dark:text-indigo-400">
                {formatTime(firstSegment.departureTime)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
                Arrival
              </p>
              <p className="mt-1 text-sm font-medium text-indigo-950 dark:text-indigo-50">
                {formatDate(lastSegment.arrivalTime)}
              </p>
              <p className="font-mono text-sm text-indigo-500 dark:text-indigo-400">
                {formatTime(lastSegment.arrivalTime)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-indigo-100 pt-4 dark:border-indigo-800">
            <span className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-700 dark:text-indigo-300">
              {flight.airline.name}
            </span>
            <span className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-700 dark:text-indigo-300">
              {flight.cabinClass}
            </span>
            <span className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-700 dark:text-indigo-300">
              {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
        <div className="border-b border-indigo-100 px-5 py-3.5 dark:border-indigo-800">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
            {BOOKING_COPY.review.passengerListTitle}
          </p>
        </div>
        <div className="divide-y divide-indigo-100 dark:divide-indigo-800">
          {passengers.map((passenger, index) => (
            <div
              key={`${passenger.firstName}-${passenger.passportNumber}-${index}`}
              className="flex items-start gap-4 px-5 py-4"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-accent dark:bg-indigo-900">
                {index + 1}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">
                  {passenger.firstName} {passenger.lastName}
                </p>
                <p className="text-xs text-indigo-400 dark:text-indigo-500">
                  {BOOKING_COPY.review.passportPrefix} {passenger.passportNumber} · {passenger.nationality}
                </p>
                <p className="text-xs text-indigo-400 dark:text-indigo-500">
                  {BOOKING_COPY.review.seatsPrefix}{" "}
                  {formatSeatSummary(extras.selectedSeats, descriptors[index]!.key)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
        <div className="border-b border-indigo-100 px-5 py-3.5 dark:border-indigo-800">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
            Price breakdown
          </p>
        </div>
        <div className="space-y-2.5 px-5 py-4 text-sm">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
            <span>{BOOKING_COPY.review.flightSubtotal}</span>
            <span className="tabular-nums font-medium">{formatMoney(price.flightSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
            <span>
              {BOOKING_COPY.review.baggageSubtotal} × {extras.extraBaggage.length}
            </span>
            <span className="tabular-nums font-medium">{formatMoney(price.baggageSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
            <span>
              {BOOKING_COPY.review.seatSubtotal} × {extras.selectedSeats.length}
            </span>
            <span className="tabular-nums font-medium">{formatMoney(price.seatSubtotal)}</span>
          </div>
          <div className="border-t border-indigo-100 pt-2.5 dark:border-indigo-800">
            <div className="flex items-center justify-between text-base font-semibold text-indigo-950 dark:text-indigo-50">
              <span>{BOOKING_COPY.review.totalDue}</span>
              <span className="tabular-nums">{formatMoney(price.total)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => setStep(1)}
        >
          {BOOKING_COPY.extras.backLabel}
        </Button>
        <Button
          type="button"
          className="rounded-lg"
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
          {BOOKING_COPY.review.confirmLabel}
        </Button>
      </div>
    </div>
  );
}
