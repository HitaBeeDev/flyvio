import { useCreateBooking } from "@/hooks/useCreateBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-5">
      <Card className="border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/75">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
            {BOOKING_COPY.review.flightSummaryTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {flight.outbound[0]!.departureAirport.city} (
            {flight.outbound[0]!.departureAirport.iata}) to{" "}
            {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city} (
            {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.iata})
          </p>
          <p>
            {BOOKING_COPY.review.departurePrefix}{" "}
            {formatDate(flight.outbound[0]!.departureTime)} at{" "}
            {formatTime(flight.outbound[0]!.departureTime)}
          </p>
          <p>
            {BOOKING_COPY.review.airlinePrefix} {flight.airline.name} ·{" "}
            {flight.cabinClass}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/75">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
            {BOOKING_COPY.review.passengerListTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {passengers.map((passenger, index) => (
            <div
              key={`${passenger.firstName}-${passenger.passportNumber}-${index}`}
              className="rounded-[1.2rem] border border-slate-200/80 px-4 py-4 text-sm dark:border-slate-800/80"
            >
              <p className="font-medium text-slate-950 dark:text-stone-100">
                {passenger.firstName} {passenger.lastName}
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                {BOOKING_COPY.review.passportPrefix} {passenger.passportNumber}{" "}
                · {passenger.nationality}
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                {BOOKING_COPY.review.seatsPrefix}{" "}
                {formatSeatSummary(
                  extras.selectedSeats,
                  descriptors[index]!.key,
                )}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/75">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
            {BOOKING_COPY.review.extrasTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {BOOKING_COPY.review.flightSubtotal}:{" "}
            {formatMoney(price.flightSubtotal)}
          </p>
          <p>
            {BOOKING_COPY.review.baggageSubtotal}:{" "}
            {formatMoney(price.baggageSubtotal)}
          </p>
          <p>
            {BOOKING_COPY.review.seatSubtotal}:{" "}
            {formatMoney(price.seatSubtotal)}
          </p>
          <p>
            {BOOKING_COPY.review.baggageSelections}:{" "}
            {extras.extraBaggage.length}
          </p>
          <p>
            {BOOKING_COPY.review.seatSelections}: {extras.selectedSeats.length}
          </p>
          <p>
            {BOOKING_COPY.review.totalDue}: {formatMoney(price.total)}
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          onClick={() => setStep(1)}
        >
          {BOOKING_COPY.extras.backLabel}
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
          {BOOKING_COPY.review.confirmLabel}
        </Button>
      </div>
    </div>
  );
}
