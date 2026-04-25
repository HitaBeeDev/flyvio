import { ArrowLeft, ChevronRight } from "lucide-react";
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
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="space-y-4">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-32 w-full rounded-[1.25rem]" />
                <Skeleton className="h-24 w-full rounded-[1.25rem]" />
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-40 w-full rounded-[1.25rem]" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-4">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-48 w-full rounded-[1.25rem]" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
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
}: {
  flight: Flight;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-3">
        <nav
          aria-label={FLIGHT_DETAIL_COPY.breadcrumb}
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
        >
          <Link to="/search" className="transition hover:text-slate-950 dark:hover:text-slate-50">
            {FLIGHT_DETAIL_COPY.searchResults}
          </Link>
          <ChevronRight className="size-4" />
          <span>
            {flight.outbound[0]!.departureAirport.city} to{" "}
            {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
          </span>
        </nav>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-xl px-0 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50"
        >
          <Link to="/search">
            <ArrowLeft className="size-4" />
            {FLIGHT_DETAIL_COPY.backToResults}
          </Link>
        </Button>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl">
          {flight.outbound[0]!.departureAirport.city} to{" "}
          {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.city}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 md:text-base">
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
    <Card className="gap-0 rounded-2xl border-slate-200 bg-white py-0 shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="border-b border-slate-100 py-5 dark:border-slate-800">
        <CardTitle className="text-2xl text-slate-950 dark:text-slate-50">
          {FLIGHT_DETAIL_COPY.bookTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-6 py-6">
        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
          {FLIGHT_DETAIL_COPY.bookDescription}
        </p>
        <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>{FLIGHT_DETAIL_COPY.chosenTravelers}</span>
            <span className="font-medium text-slate-950 dark:text-slate-50">
              {travelers}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>{FLIGHT_DETAIL_COPY.totalItineraryPrice}</span>
            <span className="font-semibold text-slate-950 dark:text-slate-50">
              {formatPrice(flight.price * travelers, "USD")}
            </span>
          </div>
        </div>
        <Button className="w-full rounded-xl shadow-none" onClick={onBook}>
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
  onBook,
}: {
  flight: Flight;
  adults: number;
  children: number;
  onBook: () => void;
}) {
  return (
    <div className="space-y-8">
      <FlightHeader flight={flight} />

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

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
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
