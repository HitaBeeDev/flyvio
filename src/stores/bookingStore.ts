import { create } from 'zustand'

type BookingState = {
  selectedFlightId: string | null
  passengers: number
  setSelectedFlight: (flightId: string | null) => void
  setPassengers: (passengers: number) => void
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedFlightId: null,
  passengers: 1,
  setSelectedFlight: (selectedFlightId) => set({ selectedFlightId }),
  setPassengers: (passengers) => set({ passengers }),
}))
