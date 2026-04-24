import { FILTER_PANEL_COPY } from "@/lib/constants";
import { formatEuro } from "./results-utils";

export function formatPriceRangeLabel(priceRange: [number, number]) {
  return `${formatEuro(priceRange[0])} - ${formatEuro(priceRange[1])}`;
}

export function formatDurationLabel(maxDuration: number) {
  return `${FILTER_PANEL_COPY.maxDurationPrefix} ${Math.floor(maxDuration / 60)}h`;
}
