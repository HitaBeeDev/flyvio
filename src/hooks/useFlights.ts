import { useQuery } from "@tanstack/react-query";
import { searchFlights } from "@/api/flights";
import type { SearchParams } from "@/types";

const FLIGHTS_STALE_TIME_MS = Number.POSITIVE_INFINITY;

export function useFlights(params: SearchParams | null) {
  return useQuery({
    queryKey: ["flights", params],
    queryFn: () => searchFlights(params!),
    enabled: params !== null,
    staleTime: FLIGHTS_STALE_TIME_MS,
    retry: 1,
  });
}
