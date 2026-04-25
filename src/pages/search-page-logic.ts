import { useEffect, useMemo, useRef } from "react";
import {
  filterFlights,
  getAirlineCounts,
  getDurationBounds,
  getPriceBounds,
  parseFilters,
  serializeFilters,
  serializeSort,
  sortFlights,
} from "@/components/features/results/results-utils";
import { DEFAULT_FILTERS } from "@/stores/searchStore";
import type { Flight, SearchParams, SortOption } from "@/types";
import type { FilterState } from "@/types/search";

export function getSearchParamsFromUrl(
  searchParams: URLSearchParams,
): Partial<SearchParams> | null {
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");

  if (!origin && !destination && !departureDate) {
    return null;
  }

  return {
    origin: origin ?? undefined,
    destination: destination ?? undefined,
    departureDate: departureDate ?? undefined,
    returnDate: searchParams.get("returnDate") ?? undefined,
    passengers: {
      adults: Number(searchParams.get("adults") ?? "1"),
      children: Number(searchParams.get("children") ?? "0"),
      infants: Number(searchParams.get("infants") ?? "0"),
    },
    cabinClass:
      (searchParams.get("cabinClass") as SearchParams["cabinClass"]) ??
      "Economy",
    isRoundTrip: (searchParams.get("trip") ?? "round-trip") === "round-trip",
  };
}

type SearchResultsStateArgs = {
  flights: Flight[];
  filters: FilterState;
  sort: SortOption;
  visibleState: { key: string; count: number };
  validSearchParams: SearchParams | null;
};

export function useSearchResultsState({
  flights,
  filters,
  sort,
  visibleState,
  validSearchParams,
}: SearchResultsStateArgs) {
  const airlineOptions = useMemo(
    () =>
      Object.values(getAirlineCounts(flights)).sort(
        (left, right) =>
          right.count - left.count || left.name.localeCompare(right.name),
      ),
    [flights],
  );
  const priceBounds = useMemo(() => getPriceBounds(flights), [flights]);
  const durationBounds = useMemo(() => getDurationBounds(flights), [flights]);
  const priceSliderBounds = useMemo<[number, number]>(
    () => [
      Math.min(priceBounds[0], filters.priceRange[0]),
      Math.max(priceBounds[1], filters.priceRange[1]),
    ],
    [filters.priceRange, priceBounds],
  );
  const durationSliderBounds = useMemo<[number, number]>(
    () => [
      Math.min(durationBounds[0], filters.maxDuration),
      Math.max(durationBounds[1], filters.maxDuration),
    ],
    [durationBounds, filters.maxDuration],
  );
  const visibleFlights = useMemo(
    () => sortFlights(filterFlights(flights, filters), sort),
    [filters, flights, sort],
  );
  const resultsStateKey = useMemo(
    () =>
      JSON.stringify({
        params: validSearchParams,
        filters,
        sort,
      }),
    [filters, sort, validSearchParams],
  );
  const visibleCount =
    visibleState.key === resultsStateKey ? visibleState.count : 20;
  const paginatedFlights = useMemo(
    () => visibleFlights.slice(0, visibleCount),
    [visibleCount, visibleFlights],
  );

  return {
    airlineOptions,
    priceSliderBounds,
    durationSliderBounds,
    visibleFlights,
    resultsStateKey,
    visibleCount,
    paginatedFlights,
  };
}

type SyncSearchStoreArgs = {
  filters: FilterState;
  sort: SortOption;
  setFilters: (filters: FilterState) => void;
  setSort: (sort: SortOption) => void;
  setUrlParams: (
    next:
      | URLSearchParams
      | ((currentParams: URLSearchParams) => URLSearchParams),
    options?: { replace?: boolean },
  ) => void;
  urlParams: URLSearchParams;
};

function areStringArraysEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function areFilterStatesEqual(left: FilterState, right: FilterState) {
  return (
    left.priceRange[0] === right.priceRange[0] &&
    left.priceRange[1] === right.priceRange[1] &&
    areStringArraysEqual(left.stops, right.stops) &&
    areStringArraysEqual(left.departureWindows, right.departureWindows) &&
    areStringArraysEqual(left.airlines, right.airlines) &&
    left.maxDuration === right.maxDuration
  );
}

function getSyncedUrlParams(
  currentParams: URLSearchParams,
  filters: FilterState,
  sort: SortOption,
) {
  const nextParams = new URLSearchParams(currentParams);

  ["price", "stops", "depart", "airlines", "maxDuration", "sort"].forEach(
    (key) => {
      nextParams.delete(key);
    },
  );

  const serializedFilters = serializeFilters(filters, DEFAULT_FILTERS);

  serializedFilters.forEach((value, key) => {
    nextParams.set(key, value);
  });

  const serializedSort = serializeSort(sort, "best");

  if (serializedSort) {
    nextParams.set("sort", serializedSort);
  }

  return nextParams;
}

export function useSyncSearchStore({
  filters,
  sort,
  setFilters,
  setSort,
  setUrlParams,
  urlParams,
}: SyncSearchStoreArgs) {
  const suppressStoreToUrlRef = useRef(false);
  const urlParamString = urlParams.toString();
  const parsedFilters = useMemo(
    () => parseFilters(new URLSearchParams(urlParamString), DEFAULT_FILTERS),
    [urlParamString],
  );
  const parsedSort = useMemo(
    () =>
      (new URLSearchParams(urlParamString).get("sort") as SortOption | null) ??
      "best",
    [urlParamString],
  );

  useEffect(() => {
    suppressStoreToUrlRef.current = true;
    setFilters(parsedFilters);
    setSort(parsedSort);
  }, [parsedFilters, parsedSort, setFilters, setSort, urlParamString]);

  useEffect(() => {
    if (suppressStoreToUrlRef.current) {
      if (areFilterStatesEqual(filters, parsedFilters) && sort === parsedSort) {
        suppressStoreToUrlRef.current = false;
      }

      return;
    }

    const nextParams = getSyncedUrlParams(
      new URLSearchParams(urlParamString),
      filters,
      sort,
    );

    if (nextParams.toString() !== urlParamString) {
      setUrlParams(nextParams, { replace: true });
    }
  }, [filters, parsedFilters, parsedSort, setUrlParams, sort, urlParamString]);
}
