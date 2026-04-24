import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, MoonStar, SunMedium } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/uiStore";

const navigation = [{ label: "Explore", to: "/explore" }] as const;

export function Navbar() {
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const savedFlightIds = useUiStore((state) => state.savedFlightIds);
  const toggleMobileNav = useUiStore((state) => state.toggleMobileNav);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const resolvedTheme = theme === "dark" ? "dark" : "light";
  const ThemeIcon = resolvedTheme === "dark" ? SunMedium : MoonStar;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const closeMobileNav = () => {
    if (mobileNavOpen) {
      toggleMobileNav();
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-4 z-40 rounded-[1.5rem] border border-transparent transition-all duration-300",
        scrolled &&
          "border-border/80 bg-white/75 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-slate-950/70",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-1 py-1">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-white/70 dark:hover:bg-slate-900/70"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-stone-100 dark:text-slate-950">
            SQ
          </span>
          <span className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              SkyQuest
            </span>
            <span className="font-serif text-xl text-slate-950 dark:text-stone-50">
              Flight Atelier
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/70 dark:hover:text-stone-100",
                  isActive &&
                    "bg-white/80 text-slate-950 shadow-sm dark:bg-slate-900/80 dark:text-stone-100",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="ml-2 inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-slate-200">
            <Heart className="size-4" />
            Saved
            <Badge variant="default">{savedFlightIds.length}</Badge>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="rounded-full border-border/80 bg-white/70 dark:bg-slate-900/70"
              >
                <ThemeIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="rounded-full border-border/80 bg-white/70 dark:bg-slate-900/70"
              >
                <ThemeIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"}
            </TooltipContent>
          </Tooltip>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open navigation menu"
            onClick={toggleMobileNav}
            className="rounded-full border-border/80 bg-white/70 dark:bg-slate-900/70"
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      <Drawer
        open={mobileNavOpen}
        onOpenChange={(open) => {
          if (open !== mobileNavOpen) {
            toggleMobileNav();
          }
        }}
      >
        <DrawerContent className="px-2 pb-6 pt-2">
          <DrawerHeader className="px-4">
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerDescription>
              Browse the current routes and saved flight state.
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-2 px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileNav}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900",
                    isActive &&
                      "bg-slate-100 text-slate-950 dark:bg-slate-900 dark:text-stone-100",
                  )
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              <span className="inline-flex items-center gap-2">
                <Heart className="size-4" />
                Saved flights
              </span>
              <Badge variant="default">{savedFlightIds.length}</Badge>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}
