import type { Flight } from '@/types'

export async function fetchFlights() {
  const response = await fetch('/api/flights')

  if (!response.ok) {
    throw new Error('Failed to fetch flights')
  }

  return (await response.json()) as Flight[]
}

export async function fetchFlight(flightId: string) {
  const response = await fetch(`/api/flights/${flightId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch flight')
  }

  return (await response.json()) as Flight
}
