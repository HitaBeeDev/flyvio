import { create } from 'zustand'

type UiState = {
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (isMobileMenuOpen: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
}))
