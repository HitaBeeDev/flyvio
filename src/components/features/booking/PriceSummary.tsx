import { useState } from "react";
import { ChevronUp, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="gap-0 border-indigo-200/80 bg-white/90 py-0 dark:border-indigo-800/80 dark:bg-indigo-950/85">
      <CardHeader className="border-b border-indigo-200/80 py-5 dark:border-indigo-800/80">
        <CardTitle className="text-2xl text-indigo-950 dark:text-indigo-50">
          {BOOKING_COPY.summary.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-6 text-sm">
        <div className="grid grid-cols-[1fr_auto] gap-3 text-indigo-700 dark:text-indigo-200">
          <span>
            {BOOKING_COPY.summary.flightPrefix} {travelerCount}
          </span>
          <span>{formatMoney(totals.flightSubtotal)}</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3 text-indigo-700 dark:text-indigo-200">
          <span>
            {BOOKING_COPY.summary.baggagePrefix} {extras.extraBaggage.length}
          </span>
          <span>
            {extras.extraBaggage.length > 0
              ? formatMoney(extras.extraBaggage.length * EXTRA_BAGGAGE_PRICE)
              : formatMoney(0)}
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3 text-indigo-700 dark:text-indigo-200">
          <span>
            {BOOKING_COPY.summary.seatsPrefix} {extras.selectedSeats.length}
          </span>
          <span>
            {extras.selectedSeats.length > 0
              ? formatMoney(extras.selectedSeats.length * SEAT_SELECTION_PRICE)
              : formatMoney(0)}
          </span>
        </div>
        <div className="rounded-[1.4rem] border border-accent/20 bg-accent/10 px-4 py-4">
          <div className="grid grid-cols-[1fr_auto] gap-3 text-base font-semibold text-indigo-950 dark:text-indigo-50">
            <span>{BOOKING_COPY.summary.total}</span>
            <span>{formatMoney(totals.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
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
          <div className="fixed inset-x-4 bottom-4 z-40 rounded-[1.8rem] border border-indigo-200/80 bg-white/95 shadow-[0_24px_80px_rgba(30,27,75,0.18)] backdrop-blur dark:border-indigo-800/80 dark:bg-indigo-950/95">
            <div className="flex items-center justify-between border-b border-indigo-200/80 px-5 py-4 dark:border-indigo-800/80">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-5 text-accent" />
                <p className="font-semibold text-indigo-950 dark:text-indigo-50">
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
            className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-[1.4rem] border border-indigo-200/80 bg-white/95 px-5 py-4 shadow-[0_18px_50px_rgba(30,27,75,0.18)] backdrop-blur dark:border-indigo-800/80 dark:bg-indigo-950/95"
          >
            <span className="text-sm text-indigo-500 dark:text-indigo-300">
              {BOOKING_COPY.summary.total}
            </span>
            <span className="text-base font-semibold text-indigo-950 dark:text-indigo-50">
              {formatMoney(totals.total)}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
