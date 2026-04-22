export interface Airport {
  iata: string
  city: string
  country: string
  name: string
  timezone: string
}

export interface Airline {
  code: string
  name: string
  logoUrl: string
}

export interface FlightSegment {
  departureAirport: Airport
  arrivalAirport: Airport
  departureTime: string
  arrivalTime: string
  duration: number
  flightNumber: string
  aircraft: string
}

export interface LayoverInfo {
  airport: Airport
  duration: number
}

export type SortOption = 'best' | 'cheapest' | 'fastest' | 'earliest'

export type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First'

export type StopFilter = 'any' | 'direct' | '1-stop' | '2+stops'

export interface Flight {
  id: string
  outbound: FlightSegment[]
  inbound?: FlightSegment[]
  stops: number
  totalDuration: number
  price: number
  airline: Airline
  cabinClass: CabinClass
  baggageAllowance: string
  isRoundTrip: boolean
}
