import { Luggage, Sofa } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { BOOKING_COPY } from "@/lib/constants";
import type { BookingExtras } from "@/types";
import {
  EXTRA_BAGGAGE_PRICE,
  isSeatUnavailable,
  type PassengerDescriptor,
} from "./booking-utils";

const seatColumns = ["A", "B", "C", "D", "E", "F"] as const;

type BaggageSectionProps = {
  passengers: PassengerDescriptor[];
  selectedKeys: string[];
  onToggle: (passengerKey: string) => void;
};

export function BaggageSection({
  passengers,
  selectedKeys,
  onToggle,
}: BaggageSectionProps) {
  return (
    <section className="rounded-[1.8rem] border border-indigo-200/80 bg-white/85 p-5 dark:border-indigo-800/80 dark:bg-indigo-950/75">
      <div className="mb-5 flex items-center gap-3">
        <Luggage className="size-5 text-accent" />
        <div>
          <p className="text-lg font-semibold text-indigo-950 dark:text-indigo-50">
            {BOOKING_COPY.extras.baggageTitle}
          </p>
          <p className="text-sm text-indigo-500 dark:text-indigo-300">
            {BOOKING_COPY.extras.baggageDescription}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {passengers.map((passenger) => (
          <label
            key={passenger.key}
            className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-indigo-200/80 px-4 py-3 dark:border-indigo-800/80"
          >
            <div>
              <p className="font-medium text-indigo-950 dark:text-indigo-50">
                {passenger.label}
              </p>
              <p className="text-sm text-indigo-500 dark:text-indigo-300">
                Add 23kg bag - ${EXTRA_BAGGAGE_PRICE}
              </p>
            </div>
            <Checkbox
              checked={selectedKeys.includes(passenger.key)}
              onCheckedChange={() => onToggle(passenger.key)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

type SeatSelectionSectionProps = {
  passenger: PassengerDescriptor;
  segmentKey: string;
  segmentLabel: string;
  departureIata: string;
  arrivalIata: string;
  extras: BookingExtras;
  onToggleSeat: (
    passengerKey: string,
    segmentKey: string,
    seatCode: string,
  ) => void;
};

function PassengerSeatGrid({
  passenger,
  segmentKey,
  extras,
  onToggleSeat,
}: Omit<
  SeatSelectionSectionProps,
  "segmentLabel" | "departureIata" | "arrivalIata"
>) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-200">
        {passenger.label}
      </p>
      <div className="overflow-x-auto">
        <div className="grid min-w-[264px] gap-2">
          {Array.from({ length: 3 }, (_, rowIndex) => {
            const rowNumber = rowIndex + 1;

            return (
              <div key={rowNumber} className="grid grid-cols-6 gap-2">
                {seatColumns.map((column) => {
                  const seatCode = `${rowNumber}${column}`;
                  const selectedByPassenger = extras.selectedSeats.some(
                    (selection) =>
                      selection.passengerKey === passenger.key &&
                      selection.flightSegmentId === segmentKey &&
                      selection.seatCode === seatCode,
                  );
                  const selectedByAnotherPassenger = extras.selectedSeats.some(
                    (selection) =>
                      selection.passengerKey !== passenger.key &&
                      selection.flightSegmentId === segmentKey &&
                      selection.seatCode === seatCode,
                  );
                  const unavailable = isSeatUnavailable(segmentKey, seatCode);

                  return (
                    <button
                      key={seatCode}
                      type="button"
                      onClick={() =>
                        onToggleSeat(passenger.key, segmentKey, seatCode)
                      }
                      disabled={unavailable || selectedByAnotherPassenger}
                      className={cn(
                        "min-h-[44px] rounded-xl border px-0 py-3 text-sm font-medium transition",
                        selectedByPassenger
                          ? "border-accent bg-accent text-white"
                          : unavailable || selectedByAnotherPassenger
                            ? "border-indigo-200 bg-indigo-200 text-indigo-400 dark:border-indigo-800 dark:bg-indigo-800 dark:text-indigo-500"
                            : "border-indigo-200 bg-white text-indigo-700 hover:border-accent/50 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
                      )}
                    >
                      {seatCode}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SeatSelectionSection({
  passenger,
  segmentKey,
  segmentLabel,
  departureIata,
  arrivalIata,
  extras,
  onToggleSeat,
}: SeatSelectionSectionProps) {
  return (
    <section className="rounded-[1.8rem] border border-indigo-200/80 bg-white/85 p-5 dark:border-indigo-800/80 dark:bg-indigo-950/75">
      <div className="mb-5 flex items-center gap-3">
        <Sofa className="size-5 text-accent" />
        <div>
          <p className="text-lg font-semibold text-indigo-950 dark:text-indigo-50">
            {segmentLabel} {BOOKING_COPY.extras.seatSelectionSuffix}
          </p>
          <p className="text-sm text-indigo-500 dark:text-indigo-300">
            {departureIata} to {arrivalIata}
          </p>
        </div>
      </div>

      <PassengerSeatGrid
        passenger={passenger}
        segmentKey={segmentKey}
        extras={extras}
        onToggleSeat={onToggleSeat}
      />
    </section>
  );
}
