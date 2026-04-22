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

export const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 5000],
  stops: ['any'],
  departureWindows: [],
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
        filters: state.filters,
        sort: state.sort,
      }),
    },
  ),
)
