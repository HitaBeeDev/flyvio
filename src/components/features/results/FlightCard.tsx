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
          "gap-0 border-indigo-200/90 bg-white/95 py-0 transition duration-300 hover:scale-[1.01] hover:border-accent/60 hover:shadow-[0_24px_70px_rgba(99,102,241,0.18)] dark:border-indigo-800/90 dark:bg-indigo-950/90",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => toggleSavedFlightId(flight.id)}
          aria-label={isSaved ? "Remove saved flight" : "Save flight"}
          className="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-full border border-indigo-200 bg-white/90 text-indigo-500 transition hover:border-accent hover:text-accent dark:border-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300"
        >
          {isSaved ? (
            <BookmarkCheck className="size-4" />
          ) : (
            <Bookmark className="size-4" />
          )}
        </button>

        <div className="grid gap-6 p-6 lg:grid-cols-[220px_1fr_180px]">
          <FlightCardHeader flight={flight} />

          <div className="space-y-4 lg:pr-6">
            <ItineraryRow label="Outbound" segments={flight.outbound} />
            {flight.isRoundTrip && flight.inbound ? (
              <>
                <Separator className="bg-indigo-200/80 dark:bg-indigo-800/80" />
                <ItineraryRow label="Inbound" segments={flight.inbound} />
              </>
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-5 lg:items-end">
            <div className="space-y-1 lg:text-right">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-indigo-400">
                Price
              </p>
              <p className="text-3xl font-semibold text-indigo-950 dark:text-indigo-50">
                €{flight.price}
              </p>
              <p className="text-sm text-indigo-500 dark:text-indigo-300">
                per person
              </p>
            </div>
            <Button
              className="w-full rounded-2xl lg:w-auto"
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
