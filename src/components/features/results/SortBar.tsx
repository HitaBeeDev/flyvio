import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";
import { SORT_OPTIONS } from "./results-utils";

type SortBarProps = {
  sort: SortOption;
  resultCount: number;
  onSortChange: (sort: SortOption) => void;
  onOpenFilters: () => void;
};

export function SortBar({
  sort,
  resultCount,
  onSortChange,
  onOpenFilters,
}: SortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-indigo-200 bg-white px-4 py-3 dark:border-indigo-800 dark:bg-indigo-950">
      <div className="flex flex-wrap items-center gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onSortChange(option.key)}
            className={cn(
              "min-h-9 rounded-lg px-4 py-1.5 text-sm font-medium transition",
              sort === option.key
                ? "bg-accent text-white"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs text-indigo-400 dark:text-indigo-500">
          Showing {resultCount} flights
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="rounded-lg lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
