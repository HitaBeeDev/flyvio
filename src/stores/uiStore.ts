import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

type UiStore = {
  theme: ThemeMode;
  mobileNavOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleMobileNav: () => void;
};

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      theme: "system",
      mobileNavOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleMobileNav: () =>
        set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
    }),
    {
      name: "flyvio-ui",
      partialize: (state) => ({
        theme: state.theme,
      }),
    },
  ),
);
