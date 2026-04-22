import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

type UiStore = {
  theme: ThemeMode
  mobileNavOpen: boolean
  savedFlightIds: string[]
  setTheme: (theme: ThemeMode) => void
  toggleMobileNav: () => void
  saveFlightId: (id: string) => void
  removeSavedFlightId: (id: string) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      theme: 'system',
      mobileNavOpen: false,
      savedFlightIds: [],
      setTheme: (theme) => set({ theme }),
      toggleMobileNav: () =>
        set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
      saveFlightId: (id) =>
        set((state) => ({
          savedFlightIds: state.savedFlightIds.includes(id)
            ? state.savedFlightIds
            : [...state.savedFlightIds, id],
        })),
      removeSavedFlightId: (id) =>
        set((state) => ({
          savedFlightIds: state.savedFlightIds.filter((savedId) => savedId !== id),
        })),
    }),
    {
      name: 'skyquest-ui',
      partialize: (state) => ({
        theme: state.theme,
        savedFlightIds: state.savedFlightIds,
      }),
    },
  ),
)
