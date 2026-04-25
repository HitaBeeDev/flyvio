import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SearchWidget } from "@/components/features/search/SearchWidget";
import { DestinationCard } from "@/components/features/explore/DestinationCard";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDestinations } from "@/hooks/useDestinations";
import { slideUp, staggerContainer, ZERO_DURATION } from "@/lib/motion";

function DestinationCardSkeleton() {
  return (
    <div className="min-w-[18.5rem] overflow-hidden rounded-[1.9rem] border border-indigo-200/80 bg-white/90 shadow-[0_18px_50px_rgba(30,27,75,0.08)] dark:border-indigo-800/80 dark:bg-indigo-950/80 md:min-w-0">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton variant="text" className="w-20" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const destinationsQuery = useDestinations();
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? ZERO_DURATION : undefined;

  useEffect(() => {
    document.title = "Flyvio — Find Your Next Flight";
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden rounded-[2.4rem] border border-indigo-200/70 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.95)_0%,_rgba(248,248,255,0.92)_52%,_rgba(238,242,255,0.92)_100%)] px-6 py-16 shadow-[0_40px_140px_rgba(30,27,75,0.12)] dark:border-indigo-800/60 dark:bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),_transparent_28%),linear-gradient(135deg,_rgba(30,27,75,0.98)_0%,_rgba(49,46,129,0.96)_56%,_rgba(30,27,75,0.98)_100%)] sm:px-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              className="absolute -left-[8%] top-[-8%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.24)_0%,_rgba(99,102,241,0.02)_68%,_transparent_74%)] blur-2xl"
              style={{
                animation:
                  "flyvio-mesh-drift 16s ease-in-out infinite alternate",
              }}
            />
            <div
              className="absolute right-[-10%] top-[12%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.16)_0%,_rgba(99,102,241,0.02)_66%,_transparent_74%)] blur-2xl"
              style={{
                animation:
                  "flyvio-mesh-drift 20s ease-in-out infinite alternate-reverse",
              }}
            />
            <div
              className="absolute bottom-[-14%] left-[18%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,_rgba(129,140,248,0.16)_0%,_rgba(129,140,248,0.02)_64%,_transparent_74%)] blur-2xl"
              style={{
                animation:
                  "flyvio-mesh-drift 18s ease-in-out infinite alternate",
              }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={transition}
            className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center"
          >
            <motion.div variants={slideUp} transition={transition}>
              <Badge className="border-indigo-200/60 bg-white/60 px-4 py-1.5 text-indigo-800 backdrop-blur hover:bg-white/60 dark:border-indigo-700/60 dark:bg-indigo-900/55 dark:text-indigo-100 dark:hover:bg-indigo-900/55">
                Search smarter
              </Badge>
            </motion.div>
            <motion.h1
              variants={slideUp}
              transition={transition}
              className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-indigo-950 sm:text-6xl md:text-7xl dark:text-indigo-50"
            >
              Find your next flight
            </motion.h1>
            <motion.p
              variants={slideUp}
              transition={transition}
              className="mt-5 max-w-2xl text-lg leading-8 text-indigo-700 dark:text-indigo-200"
            >
              Search hundreds of routes. No fees. No noise.
            </motion.p>
            <motion.div
              variants={slideUp}
              transition={transition}
              className="mt-10 w-full max-w-4xl"
            >
              <SearchWidget />
            </motion.div>
          </motion.div>
        </section>

        {!destinationsQuery.isError && (
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Explore
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
                  Popular destinations
                </h2>
              </div>
            </div>

            {destinationsQuery.isLoading ? (
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
                {Array.from({ length: 6 }, (_, index) => (
                  <DestinationCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
                {(destinationsQuery.data ?? [])
                  .slice(0, 6)
                  .map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}
