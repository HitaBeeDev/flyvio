import { motion } from "framer-motion";
import { Download, Plane, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BOOKING_CONFIRMATION_COPY } from "@/lib/constants";
import { formatDate, formatPrice, formatTime } from "@/lib/formatters";
import type { Booking } from "@/types";

export function ConfirmationSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-xl border border-indigo-200 bg-white p-10 dark:border-indigo-800 dark:bg-indigo-950">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton variant="text" className="w-32" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-800 dark:bg-indigo-950">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfirmationHero({ confirmationCode }: { confirmationCode: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="flex flex-col items-center px-6 py-6 text-center">
        <motion.svg
          viewBox="0 0 96 96"
          className="mb-4 size-12 text-accent"
          initial="hidden"
          animate="visible"
        >
          <motion.circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
          />
          <motion.path
            d="M31 49l12 12 22-25"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.3, delay: 0.28, ease: "easeOut" },
              },
            }}
          />
        </motion.svg>

        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
          {BOOKING_CONFIRMATION_COPY.confirmedLabel}
        </p>
        <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
          {BOOKING_CONFIRMATION_COPY.confirmedTitle}
        </h1>

        <div className="mt-4 flex items-center gap-6 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-6 py-2.5 dark:border-indigo-700 dark:bg-indigo-900/40">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
              Confirmation code
            </p>
            <p className="mt-0.5 font-mono text-2xl font-bold tracking-widest text-indigo-950 dark:text-indigo-50">
              {confirmationCode}
            </p>
          </div>
          <p className="max-w-[180px] text-left text-xs text-indigo-400 dark:text-indigo-500">
            Save this code — you'll need it to manage your booking.
          </p>
        </div>
      </div>
    </div>
  );
}

function FlightSummaryCard({ booking }: { booking: Booking }) {
  const firstSegment = booking.flight.outbound[0]!;
  const lastSegment = booking.flight.outbound[booking.flight.outbound.length - 1]!;

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="border-b border-indigo-100 px-5 py-3.5 dark:border-indigo-800">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
          {BOOKING_CONFIRMATION_COPY.flightSummary}
        </p>
      </div>
      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xl font-bold tracking-tight text-indigo-950 dark:text-indigo-50">
              {firstSegment.departureAirport.iata}
            </p>
            <p className="text-xs text-indigo-400 dark:text-indigo-500 truncate">
              {firstSegment.departureAirport.city}
            </p>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-px flex-1 bg-indigo-200 dark:bg-indigo-800" />
            <Plane className="size-3.5 shrink-0 -rotate-90 text-accent" />
            <div className="h-px flex-1 bg-indigo-200 dark:bg-indigo-800" />
          </div>
          <div className="min-w-0 text-right">
            <p className="font-mono text-xl font-bold tracking-tight text-indigo-950 dark:text-indigo-50">
              {lastSegment.arrivalAirport.iata}
            </p>
            <p className="text-xs text-indigo-400 dark:text-indigo-500 truncate">
              {lastSegment.arrivalAirport.city}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-indigo-100 pt-4 text-sm dark:border-indigo-800">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">Departure</p>
            <p className="mt-1 font-medium text-indigo-950 dark:text-indigo-50">
              {formatDate(firstSegment.departureTime)}
            </p>
            <p className="font-mono text-indigo-500 dark:text-indigo-400">
              {formatTime(firstSegment.departureTime)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">Arrival</p>
            <p className="mt-1 font-medium text-indigo-950 dark:text-indigo-50">
              {formatDate(lastSegment.arrivalTime)}
            </p>
            <p className="font-mono text-indigo-500 dark:text-indigo-400">
              {formatTime(lastSegment.arrivalTime)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-indigo-100 pt-3 dark:border-indigo-800">
          <span className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-700 dark:text-indigo-300">
            {booking.flight.airline.name}
          </span>
          <span className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-700 dark:text-indigo-300">
            {booking.flight.cabinClass}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-indigo-100 pt-3 dark:border-indigo-800">
          <p className="text-xs text-indigo-400 dark:text-indigo-500">
            {BOOKING_CONFIRMATION_COPY.totalPaidPrefix}
          </p>
          <p className="text-sm font-semibold tabular-nums text-indigo-950 dark:text-indigo-50">
            {formatPrice(booking.totalPrice, "USD")}
          </p>
        </div>
      </div>
    </div>
  );
}

function PassengersCard({ booking }: { booking: Booking }) {
  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="border-b border-indigo-100 px-5 py-3.5 dark:border-indigo-800">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-500">
          {BOOKING_CONFIRMATION_COPY.passengers}
        </p>
      </div>
      <div className="divide-y divide-indigo-100 dark:divide-indigo-800">
        {booking.passengers.map((passenger, index) => (
          <div
            key={`${passenger.passportNumber}-${index}`}
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
                {BOOKING_CONFIRMATION_COPY.passportPrefix}{" "}
                {passenger.passportNumber}
              </p>
              <p className="text-xs text-indigo-400 dark:text-indigo-500">
                {passenger.nationality}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BookingConfirmationContent({ booking }: { booking: Booking }) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-6">
    <div className="w-full max-w-3xl space-y-4">
      <ConfirmationHero confirmationCode={booking.confirmationCode} />

      <div className="grid gap-4 lg:grid-cols-2">
        <FlightSummaryCard booking={booking} />
        <PassengersCard booking={booking} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" className="rounded-lg" onClick={() => window.print()}>
          <Download className="size-4" />
          {BOOKING_CONFIRMATION_COPY.downloadBoardingPass}
        </Button>
        <Button asChild className="rounded-lg">
          <Link to="/">
            <Search className="size-4" />
            {BOOKING_CONFIRMATION_COPY.searchAnotherFlight}
          </Link>
        </Button>
      </div>
    </div>
    </div>
  );
}
