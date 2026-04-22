import { useQuery } from '@tanstack/react-query'
import { getDestinations } from '@/api/destinations'

export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
