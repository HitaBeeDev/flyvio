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
      <div className="-mt-8">
        <section className="flex items-center justify-center py-16 sm:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={transition}
            className="mx-auto flex w-full max-w-4xl flex-col items-center text-center"
          >
            <motion.div variants={slideUp} transition={transition}>
              <Badge className="border-slate-200 bg-slate-50 px-3 py-1 text-indigo-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-200 dark:hover:bg-slate-800">
                Flyvio
              </Badge>
            </motion.div>

            <motion.h1
              variants={slideUp}
              transition={transition}
              className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl dark:text-white"
            >
              Find your next flight
            </motion.h1>

            <motion.p
              variants={slideUp}
              transition={transition}
              className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg"
            >
              Search hundreds of routes. No fees. No noise.
            </motion.p>
            <motion.div
              variants={slideUp}
              transition={transition}
              className="mt-9 w-full max-w-4xl"
            >
              <SearchWidget />
            </motion.div>
          </motion.div>
        </section>

        {!destinationsQuery.isError && (
          <section className="space-y-4 -mt-3">
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
