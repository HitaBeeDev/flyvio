import type { Flight } from '@/types/flight'

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
  seatType: string
}

export interface BookingExtras {
  extraBaggage: number
  selectedSeats: SeatSelection[]
}

export interface Booking {
  id: string
  confirmationCode: string
  flight: Flight
  passengers: Passenger[]
  extras: BookingExtras
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}
