import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AirlineInfo } from "@/components/features/flight-detail/AirlineInfo";
import { FareBreakdown } from "@/components/features/flight-detail/FareBreakdown";
import { FlightTimeline } from "@/components/features/flight-detail/FlightTimeline";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FLIGHT_DETAIL_COPY } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";
import type { Flight } from "@/types";

export function FlightDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" className="w-40" />
        <Skeleton className="h-10 w-80" />
        <Skeleton variant="text" className="w-56" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-800 dark:bg-indigo-950">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-800 dark:bg-indigo-950">
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-36 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlightHeader({ flight }: { flight: Flight }) {
  return (
    <div className="space-y-3">
      <nav aria-label={FLIGHT_DETAIL_COPY.breadcrumb}>
        <ol className="flex items-center gap-1 text-xs text-indigo-400 dark:text-indigo-500">
          <li>
            <Link to="/" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-300">
              Home
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="size-3 opacity-50" /></li>
          <li>
            <Link to="/search" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-300">
              {FLIGHT_DETAIL_COPY.searchResults}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="size-3 opacity-50" /></li>
          <li className="font-medium text-indigo-700 dark:text-indigo-300" aria-current="page">
            {flight.outbound[0]!.departureAirport.city} to{" "}
            {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
          </li>
        </ol>
      </nav>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50 md:text-4xl">
          {flight.outbound[0]!.departureAirport.city} to{" "}
          {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
        </h1>
        <p className="mt-1 text-sm text-indigo-400 dark:text-indigo-500">
          {flight.airline.name} · {flight.cabinClass} ·{" "}
          {formatPrice(flight.price, "USD")} {FLIGHT_DETAIL_COPY.perTraveler}
        </p>
      </div>
    </div>
  );
}

function BookingCard({
  flight,
  travelers,
  onBook,
}: {
  flight: Flight;
  travelers: number;
  onBook: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="border-b border-indigo-100 px-5 py-4 dark:border-indigo-800">
        <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">
          {FLIGHT_DETAIL_COPY.bookTitle}
        </p>
      </div>
      <div className="space-y-4 px-5 py-4">
        <p className="text-xs text-indigo-400 dark:text-indigo-500">
          {FLIGHT_DETAIL_COPY.bookDescription}
        </p>
        <div className="space-y-2.5 rounded-lg bg-indigo-50 px-4 py-3 text-sm dark:bg-indigo-900/40">
          <div className="flex items-center justify-between gap-4 text-indigo-600 dark:text-indigo-300">
            <span>{FLIGHT_DETAIL_COPY.chosenTravelers}</span>
            <span className="font-medium text-indigo-950 dark:text-indigo-50">{travelers}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-indigo-600 dark:text-indigo-300">
            <span>{FLIGHT_DETAIL_COPY.totalItineraryPrice}</span>
            <span className="font-semibold tabular-nums text-indigo-950 dark:text-indigo-50">
              {formatPrice(flight.price * travelers, "USD")}
            </span>
          </div>
        </div>
        <Button className="w-full rounded-lg shadow-none" onClick={onBook}>
          {FLIGHT_DETAIL_COPY.bookButton}
        </Button>
      </div>
    </div>
  );
}

export function FlightDetailContent({
  flight,
  adults,
  children,
  onBook,
}: {
  flight: Flight;
  adults: number;
  children: number;
  onBook: () => void;
}) {
  return (
    <div className="space-y-6">
      <FlightHeader flight={flight} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <FlightTimeline title={FLIGHT_DETAIL_COPY.outbound} segments={flight.outbound} />
          {flight.isRoundTrip && flight.inbound ? (
            <FlightTimeline title={FLIGHT_DETAIL_COPY.inbound} segments={flight.inbound} />
          ) : null}
          <AirlineInfo flight={flight} />
        </div>

        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <FareBreakdown pricePerTraveler={flight.price} adults={adults} children={children} />
          <BookingCard flight={flight} travelers={adults + children} onBook={onBook} />
        </div>
      </div>
    </div>
  );
}
