import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BOOKING_COPY } from "@/lib/constants";
import { useBookingStore } from "@/stores/bookingStore";
import type { Flight } from "@/types";
import {
  getFlightSegmentsWithKeys,
  getSeatType,
  isSeatUnavailable,
  type PassengerDescriptor,
} from "./booking-utils";
import {
  bookingExtrasSchema,
  type BookingExtrasFormValues,
} from "./booking-schema";
import { BaggageSection, SeatSelectionSection } from "./ExtrasSections";

type ExtrasFormProps = {
  flight: Flight;
  passengers: PassengerDescriptor[];
};

export function ExtrasForm({ flight, passengers }: ExtrasFormProps) {
  const extras = useBookingStore((state) => state.extras);
  const setExtras = useBookingStore((state) => state.setExtras);
  const setStep = useBookingStore((state) => state.setStep);
  const segments = useMemo(() => getFlightSegmentsWithKeys(flight), [flight]);
  const { control, handleSubmit, setValue } = useForm<BookingExtrasFormValues>({
    resolver: zodResolver(bookingExtrasSchema),
    defaultValues: extras,
    values: extras,
  });
  const rawValues = useWatch({ control });
  const values: BookingExtrasFormValues = {
    extraBaggage: rawValues.extraBaggage ?? [],
    selectedSeats: (rawValues.selectedSeats ?? []).map((s) => ({
      passengerKey: s.passengerKey ?? "",
      flightSegmentId: s.flightSegmentId ?? "",
      seatCode: s.seatCode ?? "",
      seatType: s.seatType ?? "middle",
    })),
  };

  const toggleBaggage = (passengerKey: string) => {
    setExtras({
      ...values,
      extraBaggage: values.extraBaggage.includes(passengerKey)
        ? values.extraBaggage.filter((value) => value !== passengerKey)
        : [...values.extraBaggage, passengerKey],
    });
  };

  const toggleSeat = (
    passengerKey: string,
    segmentKey: string,
    seatCode: string,
  ) => {
    const occupiedByAnotherPassenger = values.selectedSeats.some(
      (selection) =>
        selection.flightSegmentId === segmentKey &&
        selection.seatCode === seatCode &&
        selection.passengerKey !== passengerKey,
    );

    if (occupiedByAnotherPassenger || isSeatUnavailable(segmentKey, seatCode)) {
      return;
    }

    const existingSelection = values.selectedSeats.find(
      (selection) =>
        selection.passengerKey === passengerKey &&
        selection.flightSegmentId === segmentKey,
    );

    if (existingSelection?.seatCode === seatCode) {
      setValue(
        "selectedSeats",
        values.selectedSeats.filter(
          (selection) =>
            !(
              selection.passengerKey === passengerKey &&
              selection.flightSegmentId === segmentKey &&
              selection.seatCode === seatCode
            ),
        ),
      );
      return;
    }

    setValue("selectedSeats", [
      ...values.selectedSeats.filter(
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
    ]);
  };

  return (
    <form
      onSubmit={handleSubmit((nextExtras) => {
        setExtras(nextExtras);
        setStep(2);
      })}
      className="space-y-5"
    >
      <BaggageSection
        passengers={passengers}
        selectedKeys={values.extraBaggage}
        onToggle={toggleBaggage}
      />

      {segments.map((segment) =>
        passengers.map((passenger) => (
          <SeatSelectionSection
            key={`${segment.key}-${passenger.key}`}
            flight={flight}
            passenger={passenger}
            segmentKey={segment.key}
            segmentLabel={segment.label}
            departureIata={segment.segment.departureAirport.iata}
            arrivalIata={segment.segment.arrivalAirport.iata}
            extras={values}
            onToggleSeat={toggleSeat}
          />
        )),
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => setStep(0)}
        >
          {BOOKING_COPY.extras.backLabel}
        </Button>
        <Button type="submit" className="rounded-lg">
          {BOOKING_COPY.extras.reviewLabel}
        </Button>
      </div>
    </form>
  );
}
