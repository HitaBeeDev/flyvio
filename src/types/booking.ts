import type { CabinClass, Flight } from './flight'

export interface Passenger {
  firstName: string
  lastName: string
  dateOfBirth: string
  passportNumber: string
  nationality: string
}

export interface SeatSelection {
  flightSegmentId: string
  seatCode: string
  seatType: 'window' | 'middle' | 'aisle'
}

export interface BookingExtras {
  extraBaggage: boolean
  selectedSeats: SeatSelection[]
}

export type BookingStatus = 'confirmed' | 'ticketed' | 'check-in-open' | 'cancelled'

export interface Booking {
  id: string
  confirmationCode: string
  flight: Flight
  passengers: Passenger[]
  extras: BookingExtras
  totalPrice: number
  status: BookingStatus
  createdAt: string
}

export interface CreateBookingPayload {
  flightId: string
  cabinClass: CabinClass
  isRoundTrip: boolean
  passengers: Passenger[]
  extras: BookingExtras
}
