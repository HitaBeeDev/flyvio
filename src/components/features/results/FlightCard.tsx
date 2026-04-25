import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FlightCard as BaseFlightCard } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { cardItem } from "@/lib/motion";
import type { Flight } from "@/types";
import { FlightCardHeader, ItineraryRow } from "./FlightCardSections";

type FlightCardProps = {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
  className?: string;
};

export function FlightCard({ flight, onSelect, className }: FlightCardProps) {
  return (
    <motion.div variants={cardItem}>
      <BaseFlightCard
        className={cn(
          "gap-0 rounded-xl border-indigo-200 bg-white py-0 transition duration-200 hover:border-indigo-300 dark:border-indigo-800 dark:bg-indigo-950 dark:hover:border-indigo-700",
          className,
        )}
      >
        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[190px_minmax(0,1fr)_124px] lg:items-stretch">
          <FlightCardHeader flight={flight} />

          <div className="space-y-3 lg:px-2">
            <ItineraryRow label="Outbound" segments={flight.outbound} />
            {flight.isRoundTrip && flight.inbound ? (
              <>
                <Separator className="bg-indigo-100 dark:bg-indigo-800" />
                <ItineraryRow label="Inbound" segments={flight.inbound} />
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-indigo-100 pt-4 lg:flex-col lg:items-end lg:justify-between lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 dark:border-indigo-800">
            <div className="text-right">
              <p className="text-2xl font-semibold tracking-normal text-indigo-950 dark:text-indigo-50">
                €{flight.price}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-indigo-400">
                per traveler
              </p>
            </div>
            <Button
              size="sm"
              className="rounded-xl px-5 shadow-none lg:w-full"
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
