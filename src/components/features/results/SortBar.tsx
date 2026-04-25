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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-indigo-200/80 bg-white/90 px-4 py-4 backdrop-blur dark:border-indigo-800/80 dark:bg-indigo-950/80">
      <div className="flex flex-wrap items-center gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onSortChange(option.key)}
            className={cn(
              "min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition",
              sort === option.key
                ? "bg-accent text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)]"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-indigo-500 dark:text-indigo-300">
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
