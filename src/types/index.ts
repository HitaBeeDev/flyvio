import { CABIN_CLASSES } from '@/lib/constants'

export type CabinClass = (typeof CABIN_CLASSES)[number]

export interface Airport {
  code: string
  city: string
  name: string
  country: string
}

export interface Airline {
  id: string
  name: string
  code: string
}

export interface Destination {
  id: string
  city: string
  country: string
  airportCode: string
  priceFrom: number
  imageUrl: string
}

export interface FlightSegment {
  id: string
  airlineId: string
  flightNumber: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
}

export interface Flight {
  id: string
  airlineId: string
  originCode: string
  destinationCode: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  stops: number
  price: number
  cabinClass: CabinClass
  segments: FlightSegment[]
}

export interface Booking {
  id: string
  flightId: string
  passengers: number
  totalPrice: number
  status: 'pending' | 'confirmed'
}
