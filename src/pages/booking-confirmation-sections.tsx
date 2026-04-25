import { motion } from "framer-motion";
import { Download, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BOOKING_CONFIRMATION_COPY } from "@/lib/constants";
import { formatDate, formatPrice, formatTime } from "@/lib/formatters";
import type { Booking } from "@/types";

export function ConfirmationSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-[2rem] border border-indigo-200/80 bg-white/90 p-8 dark:border-indigo-800/80 dark:bg-indigo-950/80">
        <div className="flex flex-col items-center space-y-5 text-center">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-10 w-72" />
          <Skeleton variant="text" className="w-48" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-indigo-200/80 bg-white/90 p-6 dark:border-indigo-800/80 dark:bg-indigo-950/80"
          >
            <div className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-20 w-full rounded-[1.2rem]" />
              <Skeleton className="h-20 w-full rounded-[1.2rem]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfirmationHero({ confirmationCode }: { confirmationCode: string }) {
  return (
    <Card className="border-border/80 bg-white/80 dark:bg-indigo-950/80">
      <CardContent className="flex flex-col items-center px-6 py-10 text-center">
        <motion.svg
          viewBox="0 0 120 120"
          className="mb-6 size-28 text-accent"
          initial="hidden"
          animate="visible"
        >
          <motion.circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.55, ease: "easeOut" },
              },
            }}
          />
          <motion.path
            d="M39 61.5 53 75l28-31"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.35, delay: 0.3, ease: "easeOut" },
              },
            }}
          />
        </motion.svg>
        <CardDescription>
          {BOOKING_CONFIRMATION_COPY.confirmedLabel}
        </CardDescription>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
          {BOOKING_CONFIRMATION_COPY.confirmedTitle}
        </h1>
        <p className="mt-3 font-mono text-2xl font-semibold text-indigo-950 dark:text-indigo-50">
          {confirmationCode}
        </p>
      </CardContent>
    </Card>
  );
}

function FlightSummaryCard({ booking }: { booking: Booking }) {
  return (
    <Card className="border-border/80 bg-white/80 dark:bg-indigo-950/80">
      <CardHeader>
        <CardDescription>
          {BOOKING_CONFIRMATION_COPY.flightSummary}
        </CardDescription>
        <CardTitle className="text-3xl">
          {booking.flight.outbound[0]!.departureAirport.iata} →{" "}
          {
            booking.flight.outbound[booking.flight.outbound.length - 1]!
              .arrivalAirport.iata
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-indigo-700 dark:text-indigo-200">
        <p>
          {BOOKING_CONFIRMATION_COPY.routePrefix}{" "}
          {booking.flight.outbound[0]!.departureAirport.city} to{" "}
          {
            booking.flight.outbound[booking.flight.outbound.length - 1]!
              .arrivalAirport.city
          }
        </p>
        <p>
          {BOOKING_CONFIRMATION_COPY.departurePrefix}{" "}
          {formatDate(booking.flight.outbound[0]!.departureTime)} at{" "}
          {formatTime(booking.flight.outbound[0]!.departureTime)}
        </p>
        <p>
          {BOOKING_CONFIRMATION_COPY.airlinePrefix}{" "}
          {booking.flight.airline.name}
        </p>
        <p>
          {BOOKING_CONFIRMATION_COPY.cabinClassPrefix}{" "}
          {booking.flight.cabinClass}
        </p>
        <p>
          {BOOKING_CONFIRMATION_COPY.totalPaidPrefix}{" "}
          {formatPrice(booking.totalPrice, "USD")}
        </p>
      </CardContent>
    </Card>
  );
}

function PassengerCard({ booking }: { booking: Booking }) {
  return (
    <Card className="border-border/80 bg-white/80 dark:bg-indigo-950/80">
      <CardHeader>
        <CardDescription>
          {BOOKING_CONFIRMATION_COPY.passengers}
        </CardDescription>
        <CardTitle className="text-3xl">
          {booking.passengers.length} {BOOKING_CONFIRMATION_COPY.travelerLabel}
          {booking.passengers.length > 1 ? "s" : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-indigo-700 dark:text-indigo-200">
        {booking.passengers.map((passenger, index) => (
          <div
            key={`${passenger.passportNumber}-${index}`}
            className="rounded-[1.2rem] border border-indigo-200/80 px-4 py-4 dark:border-indigo-800/80"
          >
            <p className="font-medium text-indigo-950 dark:text-indigo-50">
              {passenger.firstName} {passenger.lastName}
            </p>
            <p>
              {BOOKING_CONFIRMATION_COPY.passportPrefix}{" "}
              {passenger.passportNumber}
            </p>
            <p>{passenger.nationality}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function NextActionsCard() {
  return (
    <Card className="border-border/80 bg-white/80 dark:bg-indigo-950/80">
      <CardHeader>
        <CardDescription>
          {BOOKING_CONFIRMATION_COPY.nextActions}
        </CardDescription>
        <CardTitle className="text-3xl">
          {BOOKING_CONFIRMATION_COPY.nextActionsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button className="rounded-2xl" onClick={() => window.print()}>
          <Download className="size-4" />
          {BOOKING_CONFIRMATION_COPY.downloadBoardingPass}
        </Button>
        <Button asChild variant="outline" className="rounded-2xl">
          <Link to="/">
            <Search className="size-4" />
            {BOOKING_CONFIRMATION_COPY.searchAnotherFlight}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function BookingConfirmationContent({ booking }: { booking: Booking }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ConfirmationHero confirmationCode={booking.confirmationCode} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FlightSummaryCard booking={booking} />
        <PassengerCard booking={booking} />
      </div>

      <NextActionsCard />
    </div>
  );
}
