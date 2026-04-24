import { format } from "date-fns";
import { airportsByCode } from "@/data/airports";
import { formatDuration, formatPrice, formatTime } from "@/lib/formatters";
import type {
  DepartureWindow,
  FilterState,
  Flight,
  FlightSegment,
  SearchParams,
  SortOption,
  StopFilter,
} from "@/types";

export const DEPARTURE_WINDOWS: Array<{
  key: DepartureWindow;
  label: string;
  hours: [number, number];
}> = [
  { key: "morning", label: "Morning 6-12", hours: [6, 12] },
  { key: "afternoon", label: "Afternoon 12-18", hours: [12, 18] },
  { key: "evening", label: "Evening 18-24", hours: [18, 24] },
  { key: "night", label: "Night 0-6", hours: [0, 6] },
];

export const STOP_OPTIONS: Array<{ key: StopFilter; label: string }> = [
  { key: "any", label: "Any" },
  { key: "direct", label: "Direct" },
  { key: "1-stop", label: "1 Stop" },
  { key: "2+stops", label: "2+ Stops" },
];

export const SORT_OPTIONS: Array<{ key: SortOption; label: string }> = [
  { key: "best", label: "Best" },
  { key: "cheapest", label: "Cheapest" },
  { key: "fastest", label: "Fastest" },
  { key: "earliest", label: "Earliest" },
];

export function getJourneyDuration(segments: FlightSegment[]) {
  if (segments.length === 0) {
    return 0;
  }

  const departure = new Date(segments[0]!.departureTime).getTime();
  const arrival = new Date(
    segments[segments.length - 1]!.arrivalTime,
  ).getTime();
  return Math.round((arrival - departure) / 60_000);
}

export function getStopBadge(segments: FlightSegment[]) {
  const stops = Math.max(0, segments.length - 1);

  if (stops === 0) {
    return { label: "Direct", variant: "direct" as const };
  }

  if (stops === 1 && segments[1]) {
    const layoverMinutes =
      (new Date(segments[1].departureTime).getTime() -
        new Date(segments[0]!.arrivalTime).getTime()) /
      60_000;

    return {
      label: `1 stop · ${formatDuration(Math.round(layoverMinutes))} ${segments[0]!.arrivalAirport.iata}`,
      variant: "oneStop" as const,
    };
  }

  return {
    label: `${stops} stops`,
    variant: "multiStop" as const,
  };
}

export function getAirlineInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatRouteTitle(params: Partial<SearchParams>) {
  const originCode = params.origin;
  const destinationCode = params.destination;
  const origin = originCode ? airportsByCode.get(originCode) : null;
  const destination = destinationCode
    ? airportsByCode.get(destinationCode)
    : null;

  if (!originCode && destinationCode) {
    return `${destination?.city ?? destinationCode} (${destinationCode})`;
  }

  if (!originCode || !destinationCode) {
    return "Search flights";
  }

  return `${origin?.city ?? originCode} (${originCode}) → ${destination?.city ?? destinationCode} (${destinationCode})`;
}

export function formatResultsMeta(params: Partial<SearchParams>) {
  if (!params.passengers || !params.cabinClass) {
    return "Choose route details to unlock results.";
  }

  const departure = params.departureDate
    ? format(new Date(params.departureDate), "EEE, d MMM")
    : "Pick travel date";
  const travelers = [
    params.passengers.adults
      ? `${params.passengers.adults} Adult${params.passengers.adults > 1 ? "s" : ""}`
      : null,
    params.passengers.children
      ? `${params.passengers.children} Child${params.passengers.children > 1 ? "ren" : ""}`
      : null,
    params.passengers.infants
      ? `${params.passengers.infants} Infant${params.passengers.infants > 1 ? "s" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return `${departure} · ${travelers} · ${params.cabinClass}`;
}

export function formatSearchPageTitle(params: SearchParams) {
  const departure = format(new Date(params.departureDate), "EEE d MMM");
  const origin = params.origin.toUpperCase();
  const destination = params.destination.toUpperCase();

  return `${origin} → ${destination} · ${departure} — SkyQuest`;
}

export function getPriceBounds(flights: Flight[]): [number, number] {
  if (flights.length === 0) {
    return [0, 5000];
  }

  const prices = flights.map((flight) => flight.price);
  return [Math.min(...prices), Math.max(...prices)];
}

export function getDurationBounds(flights: Flight[]): [number, number] {
  if (flights.length === 0) {
    return [60, 24 * 60];
  }

  const durations = flights.map((flight) =>
    Math.max(
      getJourneyDuration(flight.outbound),
      flight.inbound ? getJourneyDuration(flight.inbound) : 0,
    ),
  );

  return [Math.min(...durations), Math.max(...durations)];
}

export function getAirlineCounts(flights: Flight[]) {
  return flights.reduce<
    Record<string, { code: string; name: string; count: number }>
  >((accumulator, flight) => {
    const existing = accumulator[flight.airline.code];

    accumulator[flight.airline.code] = existing
      ? { ...existing, count: existing.count + 1 }
      : {
          code: flight.airline.code,
          name: flight.airline.name,
          count: 1,
        };

    return accumulator;
  }, {});
}

function matchesStops(stops: number, filters: StopFilter[]) {
  if (filters.length === 0 || filters.includes("any")) {
    return true;
  }

  return filters.some((filter) => {
    if (filter === "direct") {
      return stops === 0;
    }

    if (filter === "1-stop") {
      return stops === 1;
    }

    if (filter === "2+stops") {
      return stops >= 2;
    }

    return true;
  });
}

function matchesDepartureWindow(
  departureTime: string,
  windows: DepartureWindow[],
) {
  if (windows.length === 0) {
    return true;
  }

  const hour = new Date(departureTime).getHours();

  return windows.some((windowKey) => {
    const window = DEPARTURE_WINDOWS.find(
      (candidate) => candidate.key === windowKey,
    );

    if (!window) {
      return false;
    }

    const [start, end] = window.hours;

    if (start === 0) {
      return hour >= start && hour < end;
    }

    return hour >= start && hour < end;
  });
}

export function filterFlights(flights: Flight[], filters: FilterState) {
  return flights.filter((flight) => {
    const longestJourney = Math.max(
      getJourneyDuration(flight.outbound),
      flight.inbound ? getJourneyDuration(flight.inbound) : 0,
    );

    return (
      flight.price >= filters.priceRange[0] &&
      flight.price <= filters.priceRange[1] &&
      matchesStops(flight.stops, filters.stops) &&
      matchesDepartureWindow(
        flight.outbound[0]!.departureTime,
        filters.departureWindows,
      ) &&
      (filters.airlines.length === 0 ||
        filters.airlines.includes(flight.airline.code)) &&
      longestJourney <= filters.maxDuration
    );
  });
}

export function sortFlights(flights: Flight[], sort: SortOption) {
  return [...flights].sort((left, right) => {
    if (sort === "cheapest") {
      return left.price - right.price;
    }

    if (sort === "fastest") {
      return (
        getJourneyDuration(left.outbound) - getJourneyDuration(right.outbound)
      );
    }

    if (sort === "earliest") {
      return (
        new Date(left.outbound[0]!.departureTime).getTime() -
        new Date(right.outbound[0]!.departureTime).getTime()
      );
    }

    const leftScore =
      left.stops * 180 + getJourneyDuration(left.outbound) + left.price / 8;
    const rightScore =
      right.stops * 180 + getJourneyDuration(right.outbound) + right.price / 8;
    return leftScore - rightScore;
  });
}

export function serializeFilters(filters: FilterState, defaults: FilterState) {
  const params = new URLSearchParams();

  if (
    filters.priceRange[0] !== defaults.priceRange[0] ||
    filters.priceRange[1] !== defaults.priceRange[1]
  ) {
    params.set("price", filters.priceRange.join("-"));
  }

  if (
    filters.stops.length > 0 &&
    !(filters.stops.length === 1 && filters.stops[0] === defaults.stops[0])
  ) {
    params.set("stops", filters.stops.join(","));
  }

  if (filters.departureWindows.length > 0) {
    params.set("depart", filters.departureWindows.join(","));
  }

  if (filters.airlines.length > 0) {
    params.set("airlines", filters.airlines.join(","));
  }

  if (filters.maxDuration !== defaults.maxDuration) {
    params.set("maxDuration", String(filters.maxDuration));
  }

  return params;
}

export function parseFilters(
  searchParams: URLSearchParams,
  defaults: FilterState,
): FilterState {
  const price = searchParams.get("price");
  const stops = searchParams.get("stops");
  const depart = searchParams.get("depart");
  const airlines = searchParams.get("airlines");
  const maxDuration = searchParams.get("maxDuration");

  const parsedPrice =
    price && /^\d+-\d+$/.test(price)
      ? (price.split("-").map(Number) as [number, number])
      : defaults.priceRange;

  const parsedStops = stops
    ? (stops.split(",").filter(Boolean) as StopFilter[])
    : defaults.stops;

  const parsedDepartureWindows = depart
    ? (depart.split(",").filter(Boolean) as DepartureWindow[])
    : defaults.departureWindows;

  return {
    priceRange: parsedPrice,
    stops: parsedStops.length > 0 ? parsedStops : defaults.stops,
    departureWindows: parsedDepartureWindows,
    airlines: airlines
      ? airlines.split(",").filter(Boolean)
      : defaults.airlines,
    maxDuration: maxDuration ? Number(maxDuration) : defaults.maxDuration,
  };
}

export function serializeSort(sort: SortOption, defaultSort: SortOption) {
  return sort === defaultSort ? null : sort;
}

export function formatEuro(amount: number) {
  return formatPrice(amount, "EUR");
}

export function formatJourneyWindow(segments: FlightSegment[]) {
  return `${formatTime(segments[0]!.departureTime)} — ${formatDuration(getJourneyDuration(segments))} — ${formatTime(segments[segments.length - 1]!.arrivalTime)}`;
}
