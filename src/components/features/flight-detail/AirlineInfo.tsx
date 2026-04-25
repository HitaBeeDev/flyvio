import { useState } from "react";
import { BriefcaseBusiness, CookingPot, Luggage, ShieldCheck } from "lucide-react";
import type { Flight } from "@/types";
import { getDeterministicPerformance, getFleetType, getMealLabel } from "./flight-detail-utils";

function AirlineMark({ name, logoUrl }: { name: string; logoUrl: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

  return (
    <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 text-xs font-semibold text-indigo-500 dark:border-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
      {!imageFailed ? (
        <img
          src={logoUrl}
          alt={name}
          width={48}
          height={48}
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

export function AirlineInfo({ flight }: { flight: Flight }) {
  const fleetType = getFleetType(flight);

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="border-b border-indigo-100 px-5 py-4 dark:border-indigo-800">
        <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">Airline information</p>
      </div>
      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <AirlineMark name={flight.airline.name} logoUrl={flight.airline.logoUrl} />
          <div>
            <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">{flight.airline.name}</p>
            <p className="text-xs text-indigo-400 dark:text-indigo-500">{fleetType}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: <BriefcaseBusiness className="size-4" />, label: "Carry-on", detail: "1 cabin bag included" },
            { icon: <Luggage className="size-4" />, label: "Checked bag", detail: flight.baggageAllowance },
            { icon: <CookingPot className="size-4" />, label: "Meal", detail: getMealLabel(flight.cabinClass) },
          ].map(({ icon, label, detail }) => (
            <div key={label} className="rounded-lg border border-indigo-100 px-4 py-3 dark:border-indigo-800">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-accent">{icon}</span>
                <div>
                  <p className="text-sm font-medium text-indigo-950 dark:text-indigo-50">{label}</p>
                  <p className="text-xs text-indigo-400 dark:text-indigo-500">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs text-emerald-800 dark:text-emerald-200">
              Fare includes standard cabin protections and airline self-service changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
