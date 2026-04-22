import { createQueryString, requestJson } from '@/api/client'
import type { Flight, SearchParams } from '@/types'

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  const queryString = createQueryString({
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    cabinClass: params.cabinClass,
    isRoundTrip: params.isRoundTrip,
    adults: params.passengers.adults,
    children: params.passengers.children,
    infants: params.passengers.infants,
  })

  return (await requestJson<Flight[]>(`/api/flights/search?${queryString}`)) ?? []
}

export async function getFlight(id: string): Promise<Flight | null> {
  return requestJson<Flight>(`/api/flights/${id}`)
}
