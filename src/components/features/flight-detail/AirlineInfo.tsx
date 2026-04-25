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
    <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
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
    <Card className="gap-0 rounded-2xl border-slate-200 bg-white py-0 shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="border-b border-slate-100 py-5 dark:border-slate-800">
        <CardTitle className="text-2xl text-slate-950 dark:text-slate-50">
          Airline information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 py-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <BriefcaseBusiness className="mt-0.5 size-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-950 dark:text-slate-50">
                  Carry-on
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  1 cabin bag included
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <Luggage className="mt-0.5 size-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-950 dark:text-slate-50">
                  Checked bag
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {flight.baggageAllowance}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <CookingPot className="mt-0.5 size-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-950 dark:text-slate-50">
                  Meal
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {getMealLabel(flight.cabinClass)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
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
