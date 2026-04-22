export type TravelRegion =
  | 'africa'
  | 'asia'
  | 'europe'
  | 'middle-east'
  | 'north-america'
  | 'oceania'
  | 'south-america'
  | 'global'

export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first'

export interface Airport {
  id: number
  name: string
  city: string
  country: string
  code: string
  icao: string | null
  latitude: number
  longitude: number
  altitude: number | null
  utcOffset: number | null
  daylightSavingZone: string | null
  timezone: string
  region: Exclude<TravelRegion, 'global'>
}

export interface Airline {
  id: number
  name: string
  alias: string | null
  code: string
  icao: string | null
  callsign: string | null
  country: string | null
  region: TravelRegion
}

export interface FlightPriceMap {
  economy: number
  'premium-economy': number
  business: number
  first: number
}

export interface Flight {
  id: string
  flightNumber: string
  airline: Airline
  origin: Airport
  destination: Airport
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  distanceKm: number
  stops: number
  layoverMinutes: number
  aircraft: string
  prices: FlightPriceMap
  currency: 'USD'
}

export interface Destination {
  id: string
  airportCode: string
  city: string
  country: string
  headline: string
  description: string
  imageUrl: string
}

export interface Passenger {
  id: string
  firstName: string
  lastName: string
}

export interface Booking {
  id: string
  confirmationCode: string
  status: 'confirmed' | 'ticketed' | 'check-in-open'
  bookedAt: string
  flight: Flight
  passengers: Passenger[]
  primaryContact: {
    email: string
    phone: string
  }
}
