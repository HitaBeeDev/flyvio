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
    <Card className="gap-0 rounded-2xl border-slate-200 bg-white py-0 shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="border-b border-slate-100 py-5 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <CardTitle className="mt-2 text-2xl text-slate-950 dark:text-slate-50">
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
            <p className="text-2xl font-semibold text-slate-950 dark:text-slate-50 md:text-3xl">
              {firstSegment.departureAirport.city}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {firstSegment.departureAirport.name} ·{" "}
              {firstSegment.departureAirport.iata}
            </p>
          </div>
          <p className="font-mono text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
            {formatTime(firstSegment.departureTime)}
          </p>
        </div>

        <div className="relative space-y-5 pl-8 before:absolute before:left-[0.63rem] before:top-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800">
          {segments.map((segment, index) => {
            const nextSegment = segments[index + 1];

            return (
              <div
                key={`${segment.flightNumber}-${segment.departureTime}`}
                className="space-y-4"
              >
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <span className="absolute -left-[1.95rem] top-6 size-4 rounded-full border-4 border-white bg-slate-950 shadow-[0_0_0_1px_rgba(15,23,42,0.16)] dark:border-slate-950 dark:bg-slate-100" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Flight
                      </p>
                      <p className="mt-1 font-semibold text-slate-950 dark:text-slate-50">
                        {segment.flightNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Aircraft
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {segment.aircraft}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Duration
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {formatDuration(segment.duration)}
                      </p>
                    </div>
                  </div>
                </div>

                {nextSegment ? (
                  <div className="relative rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
                    <span className="absolute -left-[1.95rem] top-5 size-4 rounded-full border-4 border-white bg-amber-400 shadow-[0_0_0_1px_rgba(245,158,11,0.24)] dark:border-slate-950" />
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
            <p className="text-2xl font-semibold text-slate-950 dark:text-slate-50 md:text-3xl">
              {lastSegment.arrivalAirport.city}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
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
            <p className="font-mono text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
              {formatTime(lastSegment.arrivalTime)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
