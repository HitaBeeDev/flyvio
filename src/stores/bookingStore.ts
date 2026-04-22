import { create } from 'zustand'

import type { Booking, BookingExtras, Passenger } from '@/types/booking'

type BookingStep = 0 | 1 | 2

type BookingStore = {
  step: BookingStep
  flightId: string | null
  passengers: Passenger[]
  extras: BookingExtras
  booking: Booking | null
  setStep: (step: BookingStep) => void
  setFlight: (flightId: string | null) => void
  setPassengers: (passengers: Passenger[]) => void
  setExtras: (extras: BookingExtras) => void
  setBooking: (booking: Booking | null) => void
  reset: () => void
}

const DEFAULT_EXTRAS: BookingExtras = {
  extraBaggage: false,
  selectedSeats: [],
}

export const useBookingStore = create<BookingStore>((set) => ({
  step: 0,
  flightId: null,
  passengers: [],
  extras: DEFAULT_EXTRAS,
  booking: null,
  setStep: (step) => set({ step }),
  setFlight: (flightId) => set({ flightId }),
  setPassengers: (passengers) => set({ passengers }),
  setExtras: (extras) => set({ extras }),
  setBooking: (booking) => set({ booking }),
  reset: () =>
    set({
      step: 0,
      flightId: null,
      passengers: [],
      extras: DEFAULT_EXTRAS,
      booking: null,
    }),
}))
