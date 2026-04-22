import { create } from 'zustand'
import type { CabinClass } from '@/types'

type SearchState = {
  originCode: string
  destinationCode: string
  cabinClass: CabinClass
  setRoute: (originCode: string, destinationCode: string) => void
  setCabinClass: (cabinClass: CabinClass) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  originCode: 'JFK',
  destinationCode: 'LHR',
  cabinClass: 'economy',
  setRoute: (originCode, destinationCode) => set({ originCode, destinationCode }),
  setCabinClass: (cabinClass) => set({ cabinClass }),
}))
