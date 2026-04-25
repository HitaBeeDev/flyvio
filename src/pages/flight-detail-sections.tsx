import { ArrowLeft, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AirlineInfo } from "@/components/features/flight-detail/AirlineInfo";
import { FareBreakdown } from "@/components/features/flight-detail/FareBreakdown";
import { FlightTimeline } from "@/components/features/flight-detail/FlightTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FLIGHT_DETAIL_COPY } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";
import type { Flight } from "@/types";

export function FlightDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton variant="text" className="w-40" />
        <Skeleton className="h-11 w-80" />
        <Skeleton variant="text" className="w-56" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="rounded-[1.75rem] border border-indigo-200/80 bg-white/90 p-6 dark:border-indigo-800/80 dark:bg-indigo-950/80"
            >
              <div className="space-y-4">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-32 w-full rounded-[1.25rem]" />
                <Skeleton className="h-24 w-full rounded-[1.25rem]" />
              </div>
            </div>
          ))}
          <div className="rounded-[1.75rem] border border-indigo-200/80 bg-white/90 p-6 dark:border-indigo-800/80 dark:bg-indigo-950/80">
            <div className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-40 w-full rounded-[1.25rem]" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-indigo-200/80 bg-white/90 p-6 dark:border-indigo-800/80 dark:bg-indigo-950/80">
            <div className="space-y-4">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-48 w-full rounded-[1.25rem]" />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-indigo-200/80 bg-white/90 p-6 dark:border-indigo-800/80 dark:bg-indigo-950/80">
            <div className="space-y-3">
              <Skeleton className="h-7 w-32" />
              <Skeleton variant="text" className="w-40" />
              <Skeleton className="h-11 w-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlightHeader({
  flight,
  isSaved,
  onToggleSave,
}: {
  flight: Flight;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <nav
          aria-label={FLIGHT_DETAIL_COPY.breadcrumb}
          className="flex flex-wrap items-center gap-2 text-sm text-indigo-500 dark:text-indigo-300"
        >
          <Link to="/search" className="transition hover:text-accent">
            {FLIGHT_DETAIL_COPY.searchResults}
          </Link>
          <ChevronRight className="size-4" />
          <span>
            {flight.outbound[0]!.departureAirport.city} to{" "}
            {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
          </span>
        </nav>
        <Button asChild variant="ghost" size="sm" className="rounded-full px-0">
          <Link to="/search">
            <ArrowLeft className="size-4" />
            {FLIGHT_DETAIL_COPY.backToResults}
          </Link>
        </Button>
        <h1 className="text-4xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
          {flight.outbound[0]!.departureAirport.city} to{" "}
          {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
        </h1>
        <p className="text-sm text-indigo-500 dark:text-indigo-300">
          {flight.airline.name} · {flight.cabinClass} ·{" "}
          {formatPrice(flight.price, "USD")} {FLIGHT_DETAIL_COPY.perTraveler}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleSave}
        aria-label={
          isSaved
            ? FLIGHT_DETAIL_COPY.removeSavedFlight
            : FLIGHT_DETAIL_COPY.saveFlight
        }
        className="inline-flex size-11 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-500 transition hover:border-accent hover:text-accent dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
      >
        {isSaved ? (
          <BookmarkCheck className="size-4" />
        ) : (
          <Bookmark className="size-4" />
        )}
      </button>
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
    <Card className="border-indigo-200/80 bg-white/90 dark:border-indigo-800/80 dark:bg-indigo-950/80">
      <CardHeader>
        <CardTitle className="text-2xl text-indigo-950 dark:text-indigo-50">
          {FLIGHT_DETAIL_COPY.bookTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-indigo-700 dark:text-indigo-200">
        <p>{FLIGHT_DETAIL_COPY.bookDescription}</p>
        <p>
          {FLIGHT_DETAIL_COPY.chosenTravelers} {travelers}
        </p>
        <p>
          {FLIGHT_DETAIL_COPY.totalItineraryPrice}{" "}
          {formatPrice(flight.price * travelers, "USD")}
        </p>
        <Button className="mt-2 rounded-2xl" onClick={onBook}>
          {FLIGHT_DETAIL_COPY.bookButton}
        </Button>
      </CardContent>
    </Card>
  );
}

export function FlightDetailContent({
  flight,
  adults,
  children,
  isSaved,
  onToggleSave,
  onBook,
}: {
  flight: Flight;
  adults: number;
  children: number;
  isSaved: boolean;
  onToggleSave: () => void;
  onBook: () => void;
}) {
  return (
    <div className="space-y-6">
      <FlightHeader
        flight={flight}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <FlightTimeline
            title={FLIGHT_DETAIL_COPY.outbound}
            segments={flight.outbound}
          />
          {flight.isRoundTrip && flight.inbound ? (
            <FlightTimeline
              title={FLIGHT_DETAIL_COPY.inbound}
              segments={flight.inbound}
            />
          ) : null}
          <AirlineInfo flight={flight} />
        </div>

        <div className="space-y-6">
          <FareBreakdown
            pricePerTraveler={flight.price}
            adults={adults}
            children={children}
          />
          <BookingCard
            flight={flight}
            travelers={adults + children}
            onBook={onBook}
          />
        </div>
      </div>
    </div>
  );
}
