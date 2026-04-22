import type { CabinClass, StopFilter } from './flight'

export interface PassengerCount {
  adults: number
  children: number
  infants: number
}

export interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: PassengerCount
  cabinClass: CabinClass
  isRoundTrip: boolean
}

export interface FilterState {
  priceRange: [number, number]
  stops: StopFilter[]
  departureWindows: DepartureWindow[]
  airlines: string[]
  maxDuration: number
}

export type DepartureWindow =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
