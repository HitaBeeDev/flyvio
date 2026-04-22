import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/api/errors'
import { getFlight } from '@/api/flights'

const FLIGHT_STALE_TIME_MS = 5 * 60 * 1000

export function useFlight(id: string) {
  return useQuery({
    queryKey: ['flight', id],
    queryFn: async () => {
      const flight = await getFlight(id)

      if (!flight) {
        throw new ApiError(404, 'Flight not found.')
      }

      return flight
    },
    enabled: id.length > 0,
    staleTime: FLIGHT_STALE_TIME_MS,
    retry: 1,
  })
}
