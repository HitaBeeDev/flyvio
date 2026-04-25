import { useState } from "react";
import { ArrowRight, Luggage } from "lucide-react";
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
    <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {!imageFailed ? (
        <img
          src={logoUrl}
          alt={name}
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-1"
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
    <div className="flex min-w-0 items-start gap-3">
      <AirlineMark
        name={flight.airline.name}
        logoUrl={flight.airline.logoUrl}
      />
      <div className="min-w-0 space-y-2">
        <p className="truncate text-sm font-semibold leading-5 text-slate-950 dark:text-slate-50">
          {flight.airline.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>{flight.cabinClass}</span>
          <span className="inline-flex items-center gap-1.5">
            <Luggage className="size-3.5" />
            {flight.baggageAllowance}
          </span>
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
  const departure = segments[0]!;
  const arrival = segments[segments.length - 1]!;
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="grid gap-2 md:grid-cols-[70px_minmax(0,1fr)] md:items-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className="grid grid-cols-[58px_minmax(0,1fr)_58px] items-center gap-3 sm:grid-cols-[64px_minmax(96px,1fr)_64px]">
        <div className="min-w-0">
          <p className="font-mono text-base font-semibold leading-none text-slate-950 dark:text-slate-50 sm:text-lg">
            {timeFormatter.format(new Date(departure.departureTime))}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {departure.departureAirport.iata}
          </p>
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-3">
            <span className="min-w-12 text-xs font-medium leading-tight text-slate-500 dark:text-slate-400">
              {formatDuration(getJourneyDuration(segments))}
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <ArrowRight className="size-4 text-slate-400" />
          </div>
          <Badge
            variant={stopBadge.variant}
            className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
          >
            {stopBadge.label}
          </Badge>
        </div>
        <div className="min-w-0 md:text-right">
          <p className="font-mono text-base font-semibold leading-none text-slate-950 dark:text-slate-50 sm:text-lg">
            {timeFormatter.format(new Date(arrival.arrivalTime))}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {arrival.arrivalAirport.iata}
          </p>
        </div>
      </div>
    </div>
  );
}
