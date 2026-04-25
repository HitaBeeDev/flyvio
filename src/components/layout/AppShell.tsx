import { useEffect, type ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { useUiStore } from "@/stores/uiStore";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;

      document.documentElement.classList.toggle(
        "dark",
        resolvedTheme === "dark",
      );
      document.documentElement.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    if (theme !== "system") {
      return undefined;
    }

    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_34%),linear-gradient(180deg,_#eef2ff_0%,_#e0e7ff_100%)] text-indigo-900 transition-colors dark:bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),_transparent_28%),linear-gradient(180deg,_#1e1b4b_0%,_#110e38_100%)] dark:text-indigo-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-indigo-950 focus:shadow-lg focus:ring-2 focus:ring-indigo-500"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <main id="main-content" className="flex-1 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
