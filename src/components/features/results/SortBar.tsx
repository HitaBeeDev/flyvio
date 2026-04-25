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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onSortChange(option.key)}
            className={cn(
              "min-h-10 rounded-full px-4 py-2 text-sm font-medium transition",
              sort === option.key
                ? "bg-indigo-950 text-white shadow-sm dark:bg-indigo-100 dark:text-indigo-950"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {resultCount} flights
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="rounded-full lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
