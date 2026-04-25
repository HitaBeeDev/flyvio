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
          "gap-0 border-slate-200 bg-white py-0 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700",
          className,
        )}
      >
        <div className="grid gap-6 p-6 lg:grid-cols-[220px_minmax(0,1fr)_150px]">
          <FlightCardHeader flight={flight} />

          <div className="space-y-4 lg:pr-6">
            <ItineraryRow label="Outbound" segments={flight.outbound} />
            {flight.isRoundTrip && flight.inbound ? (
              <>
                <Separator className="bg-slate-200 dark:bg-slate-800" />
                <ItineraryRow label="Inbound" segments={flight.inbound} />
              </>
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-5 lg:items-end">
            <div className="flex w-full items-start justify-between gap-4 lg:block lg:space-y-4 lg:text-right">
              <button
                type="button"
                onClick={() => toggleSavedFlightId(flight.id)}
                aria-label={isSaved ? "Remove saved flight" : "Save flight"}
                className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 lg:ml-auto"
              >
                {isSaved ? (
                  <BookmarkCheck className="size-4" />
                ) : (
                  <Bookmark className="size-4" />
                )}
              </button>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                  Price
                </p>
                <p className="text-3xl font-semibold text-slate-950 dark:text-white">
                  €{flight.price}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  per person
                </p>
              </div>
            </div>
            <Button
              className="w-full rounded-xl lg:w-auto"
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
