import { useState } from "react";
import {
  BriefcaseBusiness,
  CookingPot,
  Luggage,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Flight } from "@/types";
import {
  getDeterministicPerformance,
  getFleetType,
  getMealLabel,
} from "./flight-detail-utils";

type AirlineInfoProps = {
  flight: Flight;
};

function AirlineMark({ name, logoUrl }: { name: string; logoUrl: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50 text-base font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
      {!imageFailed ? (
        <img
          src={logoUrl}
          alt={name}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-2"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export function AirlineInfo({ flight }: AirlineInfoProps) {
  const onTimePerformance = getDeterministicPerformance(flight.airline.code);
  const fleetType = getFleetType(flight);

  return (
    <Card className="gap-0 border-indigo-200/80 bg-white/90 py-0 dark:border-indigo-800/80 dark:bg-indigo-950/80">
      <CardHeader className="border-b border-indigo-200/80 py-5 dark:border-indigo-800/80">
        <CardTitle className="text-2xl text-indigo-950 dark:text-indigo-50">
          Airline information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 py-6">
        <div className="flex items-center gap-4">
          <AirlineMark
            name={flight.airline.name}
            logoUrl={flight.airline.logoUrl}
          />
          <div>
            <p className="text-xl font-semibold text-indigo-950 dark:text-indigo-50">
              {flight.airline.name}
            </p>
            <p className="text-sm text-indigo-500 dark:text-indigo-300">
              {fleetType}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-[1.5rem] border border-indigo-200/80 bg-indigo-50/80 p-4 dark:border-indigo-800/80 dark:bg-indigo-900/50">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-200">
              On-time performance
            </p>
            <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">
              {onTimePerformance}%
            </p>
          </div>
          <Progress
            value={onTimePerformance}
            className="h-2.5 bg-indigo-200 dark:bg-indigo-800"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-indigo-200/80 px-4 py-4 dark:border-indigo-800/80">
            <div className="flex items-start gap-3">
              <BriefcaseBusiness className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="font-medium text-indigo-950 dark:text-indigo-50">
                  Carry-on
                </p>
                <p className="text-sm text-indigo-500 dark:text-indigo-300">
                  1 cabin bag included
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-indigo-200/80 px-4 py-4 dark:border-indigo-800/80">
            <div className="flex items-start gap-3">
              <Luggage className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="font-medium text-indigo-950 dark:text-indigo-50">
                  Checked bag
                </p>
                <p className="text-sm text-indigo-500 dark:text-indigo-300">
                  {flight.baggageAllowance}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-indigo-200/80 px-4 py-4 dark:border-indigo-800/80">
            <div className="flex items-start gap-3">
              <CookingPot className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="font-medium text-indigo-950 dark:text-indigo-50">
                  Meal
                </p>
                <p className="text-sm text-indigo-500 dark:text-indigo-300">
                  {getMealLabel(flight.cabinClass)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-emerald-200/80 bg-emerald-50/80 px-4 py-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              Fare includes standard cabin protections and airline self-service
              changes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
