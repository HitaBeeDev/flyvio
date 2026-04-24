import { FILTER_PANEL_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/types";
import {
  AirlinesFilterSection,
  DepartureTimeFilterSection,
  FilterPanelHeader,
  RangeFilterSection,
  StopsFilterSection,
} from "./FilterPanelSections";
import {
  formatDurationLabel,
  formatPriceRangeLabel,
} from "./filter-panel-utils";

type AirlineOption = {
  code: string;
  name: string;
  count: number;
};

type FilterPanelProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  priceBounds: [number, number];
  durationBounds: [number, number];
  airlines: AirlineOption[];
  className?: string;
};

export function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
  priceBounds,
  durationBounds,
  airlines,
  className,
}: FilterPanelProps) {
  const toggleStop = (nextStop: FilterState["stops"][number]) => {
    if (nextStop === "any") {
      onFiltersChange({ ...filters, stops: ["any"] });
      return;
    }

    const currentStops = filters.stops.filter((stop) => stop !== "any");
    const nextStops = currentStops.includes(nextStop)
      ? currentStops.filter((stop) => stop !== nextStop)
      : [...currentStops, nextStop];

    onFiltersChange({
      ...filters,
      stops: nextStops.length > 0 ? nextStops : ["any"],
    });
  };

  return (
    <div
      className={cn(
        "space-y-6 rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80",
        className,
      )}
    >
      <FilterPanelHeader onReset={onReset} />

      <RangeFilterSection
        title={FILTER_PANEL_COPY.sections.priceRange}
        valueLabel={formatPriceRangeLabel(filters.priceRange)}
        min={priceBounds[0]}
        max={priceBounds[1]}
        step={10}
        value={filters.priceRange}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            priceRange: value as [number, number],
          })
        }
      />

      <StopsFilterSection filters={filters} onToggleStop={toggleStop} />

      <DepartureTimeFilterSection
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      <AirlinesFilterSection
        airlines={airlines}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      <RangeFilterSection
        title={FILTER_PANEL_COPY.sections.maxFlightDuration}
        valueLabel={formatDurationLabel(filters.maxDuration)}
        min={Math.max(60, Math.floor(durationBounds[0] / 60) * 60)}
        max={Math.ceil(durationBounds[1] / 60) * 60}
        step={30}
        value={[filters.maxDuration]}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            maxDuration: value[0] ?? filters.maxDuration,
          })
        }
      />
    </div>
  );
}
