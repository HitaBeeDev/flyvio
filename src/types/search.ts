import type { CabinClass, StopFilter } from '@/types/flight'

export interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: PassengerCount
  cabinClass: CabinClass
  isRoundTrip: boolean
}

export interface PassengerCount {
  adults: number
  children: number
  infants: number
}

export interface FilterState {
  priceRange: [number, number]
  stops: StopFilter
  departureWindow: [number, number]
  airlines: string[]
  maxDuration: number
}
