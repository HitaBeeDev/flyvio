import { create } from 'zustand'

import type { BookingExtras, Passenger } from '@/types/booking'

type BookingStep = 0 | 1 | 2

type BookingStore = {
  step: BookingStep
  flightId: string | null
  passengers: Passenger[]
  extras: BookingExtras
  setStep: (step: BookingStep) => void
  setFlight: (flightId: string | null) => void
  setPassengers: (passengers: Passenger[]) => void
  setExtras: (extras: BookingExtras) => void
  reset: () => void
}

const createDefaultExtras = (): BookingExtras => ({
  extraBaggage: [],
  selectedSeats: [],
})

export const useBookingStore = create<BookingStore>((set) => ({
  step: 0,
  flightId: null,
  passengers: [],
  extras: createDefaultExtras(),
  setStep: (step) => set({ step }),
  setFlight: (flightId) => set({ flightId }),
  setPassengers: (passengers) => set({ passengers }),
  setExtras: (extras) => set({ extras }),
  reset: () =>
    set({
      step: 0,
      flightId: null,
      passengers: [],
      extras: createDefaultExtras(),
    }),
}))
