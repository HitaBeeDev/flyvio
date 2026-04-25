import { Check, MapPin } from "lucide-react";
import { AIRPORT_INPUT_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Airport } from "@/types";

type AirportInputOptionsProps = {
  listboxId: string;
  label: string;
  options: Airport[];
  value?: string;
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (value: string) => void;
};

export function AirportInputOptions({
  listboxId,
  label,
  options,
  value,
  activeIndex,
  onHover,
  onSelect,
}: AirportInputOptionsProps) {
  if (!options.length) {
    return (
      <div className="px-3 py-6 text-center text-sm text-indigo-500 dark:text-indigo-400">
        {AIRPORT_INPUT_COPY.empty}
      </div>
    );
  }

  return options.map((airport, index) => (
    <button
      key={airport.iata}
      id={`${listboxId}-${airport.iata}`}
      type="button"
      role="option"
      aria-label={label}
      aria-selected={value === airport.iata}
      onMouseEnter={() => onHover(index)}
      onClick={() => onSelect(airport.iata)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors",
        index === activeIndex
          ? "bg-indigo-100 dark:bg-indigo-900"
          : "hover:bg-indigo-50 dark:hover:bg-indigo-900/80",
      )}
    >
      <span className="flex items-start gap-3">
        <MapPin className="mt-0.5 size-4 text-indigo-400" aria-hidden="true" />
        <span>
          <span className="block text-sm font-medium text-indigo-900 dark:text-indigo-50">
            {airport.iata} · {airport.city}
          </span>
          <span className="block text-xs text-indigo-500 dark:text-indigo-400">
            {airport.name}
          </span>
        </span>
      </span>
      <Check
        className={cn(
          "size-4 text-indigo-500",
          value === airport.iata ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
    </button>
  ));
}
