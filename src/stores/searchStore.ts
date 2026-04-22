import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { SortOption } from '@/types/flight'
import type { FilterState, SearchParams } from '@/types/search'

type SearchStore = {
  params: SearchParams | null
  filters: FilterState
  sort: SortOption
  setParams: (params: SearchParams | null) => void
  setFilters: (filters: FilterState) => void
  setSort: (sort: SortOption) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 5000],
  stops: 'any',
  departureWindow: ['00:00', '23:59'],
  airlines: [],
  maxDuration: 24 * 60,
}

const DEFAULT_SORT: SortOption = 'best'

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      params: null,
      filters: DEFAULT_FILTERS,
      sort: DEFAULT_SORT,
      setParams: (params) => set({ params, filters: DEFAULT_FILTERS }),
      setFilters: (filters) => set({ filters }),
      setSort: (sort) => set({ sort }),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
    }),
    {
      name: 'search-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        params: state.params,
        sort: state.sort,
      }),
    },
  ),
)
