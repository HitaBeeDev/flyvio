import { useState } from "react";
import { Luggage, PlaneTakeoff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/formatters";
import type { Flight, FlightSegment } from "@/types";
import {
  getAirlineInitials,
  getJourneyDuration,
  getStopBadge,
} from "./results-utils";

export function AirlineMark({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
      {!imageFailed ? (
        <img
          src={logoUrl}
          alt={name}
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-2"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{getAirlineInitials(name)}</span>
      )}
    </div>
  );
}

export function FlightCardHeader({ flight }: { flight: Flight }) {
  return (
    <div className="flex items-start gap-4">
      <AirlineMark
        name={flight.airline.name}
        logoUrl={flight.airline.logoUrl}
      />
      <div className="space-y-2">
        <p className="text-lg font-semibold text-indigo-950 dark:text-indigo-50">
          {flight.airline.name}
        </p>
        <div className="space-y-1 text-sm text-indigo-500 dark:text-indigo-300">
          <p>{flight.cabinClass}</p>
          <p className="inline-flex items-center gap-2">
            <Luggage className="size-4" />
            {flight.baggageAllowance}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ItineraryRow({
  label,
  segments,
}: {
  label: string;
  segments: FlightSegment[];
}) {
  const stopBadge = getStopBadge(segments);

  return (
    <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="text-xs font-medium uppercase tracking-[0.24em] text-indigo-400">
        {label}
      </div>
      <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div>
          <p className="font-mono text-xl font-semibold text-indigo-950 dark:text-indigo-50">
            {new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).format(new Date(segments[0]!.departureTime))}
          </p>
          <p className="text-xs text-indigo-500 dark:text-indigo-300">
            {segments[0]!.departureAirport.iata}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-indigo-500 dark:text-indigo-300">
            <span>{formatDuration(getJourneyDuration(segments))}</span>
            <div className="h-px flex-1 bg-indigo-200 dark:bg-indigo-800" />
            <PlaneTakeoff className="size-4 text-accent" />
          </div>
          <Badge variant={stopBadge.variant} className="rounded-full px-3 py-1">
            {stopBadge.label}
          </Badge>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-xl font-semibold text-indigo-950 dark:text-indigo-50">
            {new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).format(new Date(segments[segments.length - 1]!.arrivalTime))}
          </p>
          <p className="text-xs text-indigo-500 dark:text-indigo-300">
            {segments[segments.length - 1]!.arrivalAirport.iata}
          </p>
        </div>
      </div>
    </div>
  );
}
