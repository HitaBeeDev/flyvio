import { useQuery } from '@tanstack/react-query'
import { fetchFlights } from '@/api'

export function useFlights() {
  return useQuery({
    queryKey: ['flights'],
    queryFn: fetchFlights,
  })
}
