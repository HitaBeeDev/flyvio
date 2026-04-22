import { useQuery } from '@tanstack/react-query'
import { fetchFlight } from '@/api'

export function useFlight(flightId: string | null) {
  return useQuery({
    queryKey: ['flights', flightId],
    queryFn: () => fetchFlight(flightId as string),
    enabled: Boolean(flightId),
  })
}
