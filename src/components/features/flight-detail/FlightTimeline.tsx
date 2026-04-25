import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  if (segments.length === 0) {
    return null;
  }

  const firstSegment = segments[0]!;
  const lastSegment = segments[segments.length - 1]!;
  const arrivalDayOffset = getArrivalDayOffset(segments);

  return (
    <Card className="gap-0 border-indigo-200/80 bg-white/90 py-0 dark:border-indigo-800/80 dark:bg-indigo-950/80">
      <CardHeader className="border-b border-indigo-200/80 py-5 dark:border-indigo-800/80">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
              {title}
            </p>
            <CardTitle className="mt-2 text-2xl text-indigo-950 dark:text-indigo-50">
              Total duration {formatDuration(getJourneyDuration(segments))}
            </CardTitle>
          </div>
          {arrivalDayOffset > 0 ? (
            <Badge variant="oneStop" className="self-start">
              +{arrivalDayOffset} day
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 px-6 py-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-3xl font-semibold text-indigo-950 dark:text-indigo-50">
              {firstSegment.departureAirport.city}
            </p>
            <p className="text-sm text-indigo-500 dark:text-indigo-300">
              {firstSegment.departureAirport.name} ·{" "}
              {firstSegment.departureAirport.iata}
            </p>
          </div>
          <p className="font-mono text-4xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
            {formatTime(firstSegment.departureTime)}
          </p>
        </div>

        <div className="relative space-y-6 pl-8 before:absolute before:left-[0.63rem] before:top-0 before:h-full before:w-px before:bg-indigo-200 dark:before:bg-indigo-800">
          {segments.map((segment, index) => {
            const nextSegment = segments[index + 1];

            return (
              <div
                key={`${segment.flightNumber}-${segment.departureTime}`}
                className="space-y-4"
              >
                <div className="relative rounded-[1.5rem] border border-indigo-200/80 bg-indigo-50/70 p-4 dark:border-indigo-800/80 dark:bg-indigo-900/40">
                  <span className="absolute -left-[1.95rem] top-6 size-4 rounded-full border-4 border-white bg-accent shadow-[0_0_0_1px_rgba(99,102,241,0.25)] dark:border-indigo-950" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-400">
                        Flight
                      </p>
                      <p className="mt-1 font-semibold text-indigo-900 dark:text-indigo-50">
                        {segment.flightNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-400">
                        Aircraft
                      </p>
                      <p className="mt-1 text-indigo-700 dark:text-indigo-200">
                        {segment.aircraft}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-400">
                        Duration
                      </p>
                      <p className="mt-1 text-indigo-700 dark:text-indigo-200">
                        {formatDuration(segment.duration)}
                      </p>
                    </div>
                  </div>
                </div>

                {nextSegment ? (
                  <div className="relative rounded-[1.35rem] border border-indigo-200/80 bg-indigo-100/80 p-4 text-sm text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-900/70 dark:text-indigo-200">
                    <span className="absolute -left-[1.95rem] top-5 size-4 rounded-full border-4 border-white bg-indigo-300 shadow-[0_0_0_1px_rgba(99,102,241,0.25)] dark:border-indigo-950 dark:bg-indigo-700" />
                    {segment.arrivalAirport.name} ·{" "}
                    {formatLayoverLabel(segment, nextSegment)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-3xl font-semibold text-indigo-950 dark:text-indigo-50">
              {lastSegment.arrivalAirport.city}
            </p>
            <p className="text-sm text-indigo-500 dark:text-indigo-300">
              {lastSegment.arrivalAirport.name} ·{" "}
              {lastSegment.arrivalAirport.iata}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {arrivalDayOffset > 0 ? (
              <Badge variant="oneStop" className="rounded-full px-3 py-1">
                +{arrivalDayOffset} day
              </Badge>
            ) : null}
            <p className="font-mono text-4xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
              {formatTime(lastSegment.arrivalTime)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
