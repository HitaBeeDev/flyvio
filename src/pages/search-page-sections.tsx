import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { FilterPanel } from "@/components/features/results/FilterPanel";
import { FlightCard } from "@/components/features/results/FlightCard";
import { FlightCardSkeleton } from "@/components/features/results/FlightCardSkeleton";
import { SortBar } from "@/components/features/results/SortBar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { SEARCH_PAGE_COPY } from "@/lib/constants";
import { staggerContainer } from "@/lib/motion";
import type { Flight, FilterState, SearchParams, SortOption } from "@/types";

type AirlineOption = {
  code: string;
  name: string;
  count: number;
};

type SearchResultsSectionProps = {
  filters: FilterState;
  sort: SortOption;
  setFilters: (filters: FilterState) => void;
  setSort: (sort: SortOption) => void;
  resetFilters: () => void;
  priceBounds: [number, number];
  durationBounds: [number, number];
  airlineOptions: AirlineOption[];
  validSearchParams: SearchParams | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
  visibleFlights: Flight[];
  paginatedFlights: Flight[];
  visibleCount: number;
  resultsStateKey: string;
  setVisibleState: Dispatch<SetStateAction<{ key: string; count: number }>>;
  onSelectFlight: (flight: Flight) => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
};

export function SearchResultsSection({
  filters,
  sort,
  setFilters,
  setSort,
  resetFilters,
  priceBounds,
  durationBounds,
  airlineOptions,
  validSearchParams,
  isLoading,
  isError,
  refetch,
  visibleFlights,
  paginatedFlights,
  visibleCount,
  resultsStateKey,
  setVisibleState,
  onSelectFlight,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: SearchResultsSectionProps) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:col-span-2">
          <SortBar
            sort={sort}
            resultCount={visibleFlights.length}
            onSortChange={setSort}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              priceBounds={priceBounds}
              durationBounds={durationBounds}
              airlines={airlineOptions}
            />
          </div>
        </aside>

        <section className="space-y-5">
          {validSearchParams == null ? (
            <EmptyState
              title={SEARCH_PAGE_COPY.invalidSearchTitle}
              description={SEARCH_PAGE_COPY.invalidSearchDescription}
              icon={<Plane className="size-12" />}
            />
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <FlightCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              title={SEARCH_PAGE_COPY.loadErrorTitle}
              description={SEARCH_PAGE_COPY.loadErrorDescription}
              ctaLabel={SEARCH_PAGE_COPY.retryLabel}
              onCtaClick={() => void refetch()}
              icon={<Plane className="size-12" />}
            />
          ) : visibleFlights.length > 0 ? (
            <div className="space-y-5">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {paginatedFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={onSelectFlight}
                  />
                ))}
              </motion.div>

              {visibleCount < visibleFlights.length ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleState({
                        key: resultsStateKey,
                        count: visibleCount + 20,
                      })
                    }
                  className="rounded-lg border border-indigo-200 bg-white px-5 py-2.5 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {SEARCH_PAGE_COPY.loadMoreLabel}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title={SEARCH_PAGE_COPY.emptyTitle}
              description={SEARCH_PAGE_COPY.emptyDescription}
              ctaLabel={SEARCH_PAGE_COPY.resetFiltersLabel}
              onCtaClick={resetFilters}
              icon={<Plane className="size-12" />}
            />
          )}
        </section>
      </div>

      <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DrawerContent className="px-2 pb-6 pt-2 lg:hidden">
          <DrawerHeader className="px-4">
            <DrawerTitle>{SEARCH_PAGE_COPY.filtersTitle}</DrawerTitle>
            <DrawerDescription>
              {SEARCH_PAGE_COPY.filtersDescription}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-2">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              priceBounds={priceBounds}
              durationBounds={durationBounds}
              airlines={airlineOptions}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
