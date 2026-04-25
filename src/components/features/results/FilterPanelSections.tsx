import type { PropsWithChildren } from "react";
import { RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { FILTER_PANEL_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/types";
import { DEPARTURE_WINDOWS, STOP_OPTIONS } from "./results-utils";

type AirlineOption = {
  code: string;
  name: string;
  count: number;
};

type FilterSectionProps = PropsWithChildren<{ title: string }>;

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function FilterPanelHeader({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {FILTER_PANEL_COPY.eyebrow}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {FILTER_PANEL_COPY.description}
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        aria-label={FILTER_PANEL_COPY.resetLabel}
        title={FILTER_PANEL_COPY.resetLabel}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-50"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}

type RangeFilterSectionProps = {
  title: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number[] | [number, number];
  onValueChange: (value: number[]) => void;
};

export function RangeFilterSection({
  title,
  valueLabel,
  min,
  max,
  step,
  value,
  onValueChange,
}: RangeFilterSectionProps) {
  return (
    <FilterSection title={title}>
      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 dark:bg-slate-900 dark:text-slate-100">
        {valueLabel}
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
    </FilterSection>
  );
}

export function StopsFilterSection({
  filters,
  onToggleStop,
}: {
  filters: FilterState;
  onToggleStop: (stop: FilterState["stops"][number]) => void;
}) {
  return (
    <FilterSection title={FILTER_PANEL_COPY.sections.stops}>
      <div className="space-y-3">
        {STOP_OPTIONS.map((option) => (
          <label
            key={option.key}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            <span>{option.label}</span>
            <Checkbox
              checked={filters.stops.includes(option.key)}
              onCheckedChange={() => onToggleStop(option.key)}
            />
          </label>
        ))}
      </div>
    </FilterSection>
  );
}

export function DepartureTimeFilterSection({
  filters,
  onFiltersChange,
}: {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}) {
  return (
    <FilterSection title={FILTER_PANEL_COPY.sections.departureTime}>
      <div className="grid grid-cols-2 gap-2">
        {DEPARTURE_WINDOWS.map((window) => {
          const active = filters.departureWindows.includes(window.key);

          return (
            <button
              key={window.key}
              type="button"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  departureWindows: active
                    ? filters.departureWindows.filter(
                        (item) => item !== window.key,
                      )
                    : [...filters.departureWindows, window.key],
                })
              }
              className={cn(
                "rounded-xl border px-3 py-3 text-left text-sm transition",
                active
                  ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900",
              )}
            >
              {window.label}
            </button>
          );
        })}
      </div>
    </FilterSection>
  );
}

export function AirlinesFilterSection({
  airlines,
  filters,
  onFiltersChange,
}: {
  airlines: AirlineOption[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}) {
  return (
    <FilterSection title={FILTER_PANEL_COPY.sections.airlines}>
      <ScrollArea className="h-52 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-2 py-3">
          {airlines.map((airline) => (
            <label
              key={airline.code}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={filters.airlines.includes(airline.code)}
                  onCheckedChange={() =>
                    onFiltersChange({
                      ...filters,
                      airlines: filters.airlines.includes(airline.code)
                        ? filters.airlines.filter(
                            (code) => code !== airline.code,
                          )
                        : [...filters.airlines, airline.code],
                    })
                  }
                />
                <span>{airline.name}</span>
              </div>
              <span className="text-slate-400">{airline.count}</span>
            </label>
          ))}
        </div>
      </ScrollArea>
    </FilterSection>
  );
}
