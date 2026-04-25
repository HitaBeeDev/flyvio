import { Badge } from "@/components/ui/badge";
import { formatDuration, formatTime } from "@/lib/formatters";
import type { FlightSegment } from "@/types";
import {
  formatLayoverLabel,
  getArrivalDayOffset,
  getJourneyDuration,
} from "./flight-detail-utils";

type FlightTimelineProps = {
  title: string;
  segments: FlightSegment[];
};

export function FlightTimeline({ title, segments }: FlightTimelineProps) {
  if (segments.length === 0) return null;

  const firstSegment = segments[0]!;
  const lastSegment = segments[segments.length - 1]!;
  const arrivalDayOffset = getArrivalDayOffset(segments);

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="flex items-start justify-between gap-4 border-b border-indigo-100 px-5 py-4 dark:border-indigo-800">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            {title}
          </p>
          <p className="mt-1 text-base font-semibold text-indigo-950 dark:text-indigo-50">
            Total duration {formatDuration(getJourneyDuration(segments))}
          </p>
        </div>
        {arrivalDayOffset > 0 && (
          <Badge variant="oneStop" className="self-start">+{arrivalDayOffset} day</Badge>
        )}
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xl font-semibold text-indigo-950 dark:text-indigo-50">
              {firstSegment.departureAirport.city}
            </p>
            <p className="text-xs text-indigo-400 dark:text-indigo-500">
              {firstSegment.departureAirport.name} · {firstSegment.departureAirport.iata}
            </p>
          </div>
          <p className="font-mono text-2xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
            {formatTime(firstSegment.departureTime)}
          </p>
        </div>

        <div className="relative space-y-4 pl-7 before:absolute before:left-[0.55rem] before:top-0 before:h-full before:w-px before:bg-indigo-200 dark:before:bg-indigo-800">
          {segments.map((segment, index) => {
            const nextSegment = segments[index + 1];
            return (
              <div key={`${segment.flightNumber}-${segment.departureTime}`} className="space-y-3">
                <div className="relative rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-800 dark:bg-indigo-900/40">
                  <span className="absolute -left-[1.82rem] top-5 size-3.5 rounded-full border-2 border-white bg-accent dark:border-indigo-950" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">Flight</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-indigo-950 dark:text-indigo-50">{segment.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">Aircraft</p>
                      <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-300">{segment.aircraft}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">Duration</p>
                      <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-300">{formatDuration(segment.duration)}</p>
                    </div>
                  </div>
                </div>

                {nextSegment && (
                  <div className="relative rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
                    <span className="absolute -left-[1.82rem] top-4 size-3.5 rounded-full border-2 border-white bg-amber-400 dark:border-indigo-950" />
                    {segment.arrivalAirport.name} · {formatLayoverLabel(segment, nextSegment)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xl font-semibold text-indigo-950 dark:text-indigo-50">
              {lastSegment.arrivalAirport.city}
            </p>
            <p className="text-xs text-indigo-400 dark:text-indigo-500">
              {lastSegment.arrivalAirport.name} · {lastSegment.arrivalAirport.iata}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {arrivalDayOffset > 0 && (
              <Badge variant="oneStop" className="rounded-md px-2 py-0.5">
                +{arrivalDayOffset} day
              </Badge>
            )}
            <p className="font-mono text-2xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
              {formatTime(lastSegment.arrivalTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
