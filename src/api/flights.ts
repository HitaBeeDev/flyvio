import { generateFlightsForRoute } from '@/data/flights'
import type { CabinClass, Flight, SearchParams } from '@/types'

const cabins: CabinClass[] = ['Economy', 'Premium Economy', 'Business', 'First']

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  await delay(240)

  return generateFlightsForRoute(
    params.origin,
    params.destination,
    params.departureDate,
    params.cabinClass,
    params.isRoundTrip,
  )
}

export async function getFlight(id: string): Promise<Flight | null> {
  const match = id.match(
    /^(?<origin>[A-Z]{3})-(?<destination>[A-Z]{3})-(?<date>\d{4}-\d{2}-\d{2})-(?<index>\d+)$/,
  )

  if (!match?.groups) {
    return null
  }

  const origin = match.groups.origin!
  const destination = match.groups.destination!
  const date = match.groups.date!

  for (const cabin of cabins) {
    for (const isRoundTrip of [true, false]) {
      const flights = generateFlightsForRoute(
        origin,
        destination,
        date,
        cabin,
        isRoundTrip,
      )
      const flight = flights.find((candidate) => candidate.id === id)

      if (flight) {
        return flight
      }
    }
  }

  return null
}
