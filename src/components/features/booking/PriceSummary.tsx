import { useState } from "react";
import { ChevronUp, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOKING_COPY } from "@/lib/constants";
import { useBookingStore } from "@/stores/bookingStore";
import type { Flight } from "@/types";
import {
  calculateBookingPrice,
  EXTRA_BAGGAGE_PRICE,
  formatMoney,
  SEAT_SELECTION_PRICE,
} from "./booking-utils";

type PriceSummaryProps = {
  flight: Flight;
  travelerCount: number;
};

function SummaryCard({ flight, travelerCount }: PriceSummaryProps) {
  const extras = useBookingStore((state) => state.extras);
  const totals = calculateBookingPrice(flight, extras, travelerCount);

  return (
    <div className="rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="border-b border-indigo-100 px-5 py-4 dark:border-indigo-800">
        <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">
          {BOOKING_COPY.summary.title}
        </p>
      </div>
      <div className="space-y-3 px-5 py-4 text-sm">
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
          <span>
            {BOOKING_COPY.summary.flightPrefix} {travelerCount}
          </span>
          <span className="font-medium tabular-nums">{formatMoney(totals.flightSubtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
          <span>
            {BOOKING_COPY.summary.baggagePrefix} {extras.extraBaggage.length}
          </span>
          <span className="font-medium tabular-nums">
            {extras.extraBaggage.length > 0
              ? formatMoney(extras.extraBaggage.length * EXTRA_BAGGAGE_PRICE)
              : formatMoney(0)}
          </span>
        </div>
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
          <span>
            {BOOKING_COPY.summary.seatsPrefix} {extras.selectedSeats.length}
          </span>
          <span className="font-medium tabular-nums">
            {extras.selectedSeats.length > 0
              ? formatMoney(extras.selectedSeats.length * SEAT_SELECTION_PRICE)
              : formatMoney(0)}
          </span>
        </div>
        <div className="border-t border-indigo-100 pt-3 dark:border-indigo-800">
          <div className="flex items-center justify-between text-base font-semibold text-indigo-950 dark:text-indigo-50">
            <span>{BOOKING_COPY.summary.total}</span>
            <span className="tabular-nums">{formatMoney(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PriceSummary({ flight, travelerCount }: PriceSummaryProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const extras = useBookingStore((state) => state.extras);
  const totals = calculateBookingPrice(flight, extras, travelerCount);

  return (
    <>
      <div className="hidden lg:block lg:sticky lg:top-28">
        <SummaryCard flight={flight} travelerCount={travelerCount} />
      </div>

      <div className="lg:hidden">
        {mobileExpanded ? (
          <div className="fixed inset-x-4 bottom-4 z-40 overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-lg dark:border-indigo-800 dark:bg-indigo-950">
            <div className="flex items-center justify-between border-b border-indigo-100 px-5 py-3 dark:border-indigo-800">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-4 text-accent" />
                <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">
                  {BOOKING_COPY.summary.title}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileExpanded(false)}
              >
                <ChevronUp className="size-4" />
              </Button>
            </div>
            <div className="p-4">
              <SummaryCard flight={flight} travelerCount={travelerCount} />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMobileExpanded(true)}
            className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-xl border border-indigo-200 bg-white px-5 py-3.5 shadow-md dark:border-indigo-800 dark:bg-indigo-950"
          >
            <span className="text-sm text-indigo-500 dark:text-indigo-400">
              {BOOKING_COPY.summary.total}
            </span>
            <span className="text-sm font-semibold tabular-nums text-indigo-950 dark:text-indigo-50">
              {formatMoney(totals.total)}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
