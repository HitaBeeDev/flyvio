import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ResultsSummary } from "@/components/features/results/ResultsSummary";
import { formatSearchPageTitle } from "@/components/features/results/results-utils";
import { AppShell } from "@/components/layout/AppShell";
import { useFlights } from "@/hooks/useFlights";
import { SEARCH_PAGE_COPY } from "@/lib/constants";
import { useSearchStore } from "@/stores/searchStore";
import type { SearchParams } from "@/types";
import { useBookingStore } from "@/stores/bookingStore";
import {
  getSearchParamsFromUrl,
  useSearchResultsState,
  useSyncSearchStore,
} from "./search-page-logic";
import { SearchResultsSection } from "./search-page-sections";

export function SearchPage() {
  const navigate = useNavigate();
  const [urlParams, setUrlParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleState, setVisibleState] = useState({ key: "", count: 20 });
  const filters = useSearchStore((state) => state.filters);
  const sort = useSearchStore((state) => state.sort);
  const setFilters = useSearchStore((state) => state.setFilters);
  const setSort = useSearchStore((state) => state.setSort);
  const resetFilters = useSearchStore((state) => state.resetFilters);
  const setFlight = useBookingStore((state) => state.setFlight);
  const hasUrlParams = urlParams.toString().length > 0;
  const resolvedParams = useMemo(
    () => getSearchParamsFromUrl(urlParams),
    [urlParams],
  );
  const summaryParams = resolvedParams ?? {};
  const validSearchParams = useMemo(() => {
    if (
      !resolvedParams?.origin ||
      !resolvedParams.destination ||
      !resolvedParams.departureDate ||
      !resolvedParams.passengers ||
      !resolvedParams.cabinClass ||
      typeof resolvedParams.isRoundTrip !== "boolean"
    ) {
      return null;
    }

    return resolvedParams as SearchParams;
  }, [resolvedParams]);

  useSyncSearchStore({
    filters,
    sort,
    setFilters,
    setSort,
    setUrlParams,
    urlParams,
  });

  const {
    data: flights = [],
    isLoading,
    isError,
    refetch,
  } = useFlights(validSearchParams);

  const {
    airlineOptions,
    priceSliderBounds,
    durationSliderBounds,
    visibleFlights,
    resultsStateKey,
    visibleCount,
    paginatedFlights,
  } = useSearchResultsState({
    flights,
    filters,
    sort,
    visibleState,
    validSearchParams,
  });

  useEffect(() => {
    document.title =
      validSearchParams == null
        ? SEARCH_PAGE_COPY.titleFallback
        : formatSearchPageTitle(validSearchParams);
  }, [validSearchParams]);

  if (!hasUrlParams) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <ResultsSummary params={summaryParams} />

        <SearchResultsSection
          filters={filters}
          sort={sort}
          setFilters={setFilters}
          setSort={setSort}
          resetFilters={resetFilters}
          priceBounds={priceSliderBounds}
          durationBounds={durationSliderBounds}
          airlineOptions={airlineOptions}
          validSearchParams={validSearchParams}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
          visibleFlights={visibleFlights}
          paginatedFlights={paginatedFlights}
          visibleCount={visibleCount}
          resultsStateKey={resultsStateKey}
          setVisibleState={setVisibleState}
          onSelectFlight={(selectedFlight) => {
            setFlight(selectedFlight.id);
            navigate(`/flights/${selectedFlight.id}`);
          }}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
      </div>
    </AppShell>
  );
}
