import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlightCard as BaseFlightCard } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/uiStore";
import { cardItem } from "@/lib/motion";
import type { Flight } from "@/types";
import { FlightCardHeader, ItineraryRow } from "./FlightCardSections";

type FlightCardProps = {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
  className?: string;
};

export function FlightCard({ flight, onSelect, className }: FlightCardProps) {
  const savedFlightIds = useUiStore((state) => state.savedFlightIds);
  const toggleSavedFlightId = useUiStore((state) => state.toggleSavedFlightId);
  const isSaved = savedFlightIds.includes(flight.id);

  return (
    <motion.div variants={cardItem}>
      <BaseFlightCard
        className={cn(
          "gap-0 rounded-lg border-slate-200 bg-white py-0 shadow-none transition duration-200 hover:border-slate-300 hover:bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80",
          className,
        )}
      >
        <div className="grid gap-4 p-5 lg:grid-cols-[180px_minmax(0,1fr)_132px] lg:items-stretch">
          <FlightCardHeader flight={flight} />

          <div className="space-y-3 lg:px-2">
            <ItineraryRow label="Outbound" segments={flight.outbound} />
            {flight.isRoundTrip && flight.inbound ? (
              <>
                <Separator className="bg-slate-100 dark:bg-slate-800" />
                <ItineraryRow label="Inbound" segments={flight.inbound} />
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:flex-col lg:items-end lg:justify-between lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="flex w-full items-start justify-between gap-3 lg:flex-col lg:items-end">
              <button
                type="button"
                onClick={() => toggleSavedFlightId(flight.id)}
                aria-label={isSaved ? "Remove saved flight" : "Save flight"}
                className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {isSaved ? (
                  <BookmarkCheck className="size-4" />
                ) : (
                  <Bookmark className="size-4" />
                )}
              </button>
              <div className="text-right">
                <p className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">
                  €{flight.price}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  per traveler
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-md px-5 shadow-none lg:w-full"
              onClick={() => onSelect?.(flight)}
            >
              Select
            </Button>
          </div>
        </div>
      </BaseFlightCard>
    </motion.div>
  );
}
