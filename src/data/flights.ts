import { airlines, airlinesByCode } from "@/data/airlines";
import {
  airports,
  airportsByCode,
  getRegionFromTimezone,
  type AirportRecord,
} from "@/data/airports";
import type {
  Airline,
  Airport,
  CabinClass,
  Flight,
  FlightSegment,
  Region,
} from "@/types";

type RouteCategory =
  | "intra"
  | "regional"
  | "transatlantic"
  | "long-haul"
  | "ultra-long";

const aircraftByCategory: Record<RouteCategory, string[]> = {
  intra: [
    "Airbus A220-300",
    "Airbus A320neo",
    "Boeing 737 MAX 8",
    "Embraer E195-E2",
  ],
  regional: [
    "Airbus A321neo",
    "Boeing 737-900ER",
    "Airbus A330-300",
    "Boeing 787-8",
  ],
  transatlantic: [
    "Airbus A330-900neo",
    "Boeing 787-9",
    "Airbus A350-900",
    "Boeing 777-200ER",
  ],
  "long-haul": [
    "Airbus A350-900",
    "Boeing 787-9",
    "Boeing 777-300ER",
    "Airbus A330-900neo",
  ],
  "ultra-long": [
    "Airbus A350-1000",
    "Boeing 787-10",
    "Boeing 777-300ER",
    "Airbus A380-800",
  ],
};

const categoryProfiles: Record<
  RouteCategory,
  {
    directMinutes: [number, number];
    baseFare: [number, number];
  }
> = {
  intra: { directMinutes: [65, 145], baseFare: [85, 220] },
  regional: { directMinutes: [120, 260], baseFare: [160, 420] },
  transatlantic: { directMinutes: [410, 565], baseFare: [520, 980] },
  "long-haul": { directMinutes: [520, 840], baseFare: [640, 1350] },
  "ultra-long": { directMinutes: [860, 1140], baseFare: [980, 1850] },
};

const baggageAllowanceByCabin: Record<CabinClass, string> = {
  Economy: "1 checked bag",
  "Premium Economy": "2 checked bags",
  Business: "2 checked bags + priority",
  First: "3 checked bags + priority",
};

const cabinPriceMultiplier: Record<CabinClass, number> = {
  Economy: 1,
  "Premium Economy": 1.45,
  Business: 2.35,
  First: 3.8,
};

const airlinesByRegion: Record<Region, string[]> = {
  "North America": ["AA", "DL", "UA", "WN", "B6", "AS", "AC", "WS", "AM", "CM"],
  "South America": ["LA", "AV", "AR", "H2", "AD", "LP"],
  Europe: [
    "IB",
    "UX",
    "BA",
    "AF",
    "KL",
    "LH",
    "LX",
    "OS",
    "TP",
    "AY",
    "SK",
    "LO",
    "AZ",
    "TK",
    "JU",
    "A3",
    "RO",
  ],
  Africa: ["MS", "ET", "KQ", "SA", "AT", "HM"],
  "Middle East": ["QR", "EK", "EY", "GF", "SV", "RJ", "ME", "WY", "KU"],
  Asia: [
    "PK",
    "AI",
    "6E",
    "UK",
    "SQ",
    "TR",
    "MH",
    "GA",
    "TG",
    "VN",
    "CX",
    "JL",
    "NH",
    "KE",
    "OZ",
    "CA",
    "MU",
    "CZ",
    "HU",
    "MF",
    "BI",
    "PR",
    "CI",
  ],
  Oceania: ["QF", "JQ", "VA", "NZ", "FJ", "PX", "TN", "SB", "NF"],
};

const pairAirlinePreferences: Record<string, string[]> = {
  "Asia|Middle East": [
    "EK",
    "QR",
    "EY",
    "WY",
    "GF",
    "SV",
    "SQ",
    "MH",
    "TG",
    "CX",
    "GA",
    "AI",
    "6E",
  ],
  "Europe|North America": [
    "BA",
    "AF",
    "KL",
    "LH",
    "IB",
    "TP",
    "AC",
    "AA",
    "DL",
    "UA",
    "WS",
  ],
  "Europe|Asia": [
    "TK",
    "AY",
    "BA",
    "AF",
    "KL",
    "LH",
    "SQ",
    "CX",
    "JL",
    "NH",
    "EK",
    "QR",
  ],
  "North America|Asia": [
    "AA",
    "DL",
    "UA",
    "AC",
    "JL",
    "NH",
    "KE",
    "OZ",
    "CA",
    "MU",
    "CZ",
    "CI",
    "SQ",
  ],
  "Oceania|Asia": [
    "QF",
    "JQ",
    "VA",
    "NZ",
    "SQ",
    "MH",
    "GA",
    "TG",
    "CX",
    "PR",
    "CI",
  ],
  "Europe|Oceania": ["QF", "EK", "QR", "SQ", "MH", "BA", "TK"],
  "Africa|Europe": ["ET", "MS", "KQ", "AT", "SA", "BA", "AF", "KL", "LH", "TK"],
  "North America|South America": ["LA", "AV", "CM", "AM", "AA", "DL", "UA"],
};

const hubsByRegion: Record<Region, string[]> = {
  "North America": [
    "ATL",
    "JFK",
    "ORD",
    "DFW",
    "LAX",
    "SFO",
    "YYZ",
    "YVR",
    "MEX",
    "MIA",
  ],
  "South America": ["BOG", "LIM", "GRU", "GIG", "SCL", "EZE", "UIO", "MDE"],
  Europe: [
    "LHR",
    "CDG",
    "AMS",
    "FRA",
    "MAD",
    "ZRH",
    "VIE",
    "HEL",
    "BCN",
    "IST",
  ],
  Africa: ["CAI", "ADD", "NBO", "JNB", "CPT", "CMN", "LOS"],
  "Middle East": ["DXB", "DOH", "AUH", "RUH", "JED", "MCT", "AMM"],
  Asia: [
    "SIN",
    "HKG",
    "BKK",
    "KUL",
    "TPE",
    "ICN",
    "NRT",
    "HND",
    "DEL",
    "BOM",
    "PVG",
    "PEK",
  ],
  Oceania: ["SYD", "MEL", "AKL", "BNE", "PER", "NAN"],
};

function xmur3(value: string) {
  let hash = 1779033703 ^ value.length;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return function nextHash() {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function mulberry32(seed: number) {
  return function random() {
    let next = (seed += 0x6d2b79f5);
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(random: () => number, min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pickRandom<T>(random: () => number, values: T[]) {
  return values[Math.floor(random() * values.length)]!;
}

function sampleWithoutReplacement<T>(
  random: () => number,
  values: T[],
  count: number,
) {
  const pool = [...values];
  const sampled: T[] = [];

  while (pool.length > 0 && sampled.length < count) {
    sampled.push(pool.splice(randomInt(random, 0, pool.length - 1), 1)[0]!);
  }

  return sampled;
}

function resolveAirport(airport: string | Airport) {
  if (typeof airport !== "string") {
    const resolved = airportsByCode.get(airport.iata);
    return (
      resolved ?? {
        ...airport,
        region: getRegionFromTimezone(airport.timezone),
      }
    );
  }

  const resolved = airportsByCode.get(airport.toUpperCase());

  if (!resolved) {
    throw new Error(`Unknown airport code: ${airport}`);
  }

  return resolved;
}

function getPairKey(left: Region, right: Region) {
  return [left, right].sort((a, b) => a.localeCompare(b)).join("|");
}

function getRouteCategory(
  origin: AirportRecord,
  destination: AirportRecord,
): RouteCategory {
  if (origin.country === destination.country) {
    return "intra";
  }

  if (origin.region === destination.region) {
    return "regional";
  }

  const pairKey = getPairKey(origin.region, destination.region);

  if (pairKey === "Europe|North America") {
    return "transatlantic";
  }

  if (
    pairKey === "Europe|Oceania" ||
    pairKey === "North America|Oceania" ||
    pairKey === "Asia|South America"
  ) {
    return "ultra-long";
  }

  return "long-haul";
}

function getAirlinePool(origin: AirportRecord, destination: AirportRecord) {
  const pairKey = getPairKey(origin.region, destination.region);
  const preferredCodes = [
    ...(pairAirlinePreferences[pairKey] ?? []),
    ...airlinesByRegion[origin.region],
    ...airlinesByRegion[destination.region],
  ];

  const pool = preferredCodes
    .map((code) => airlinesByCode.get(code))
    .filter((airline): airline is Airline => Boolean(airline));

  return pool.length > 0 ? pool : airlines;
}

function getHubRegionsForRoute(
  originRegion: Region,
  destinationRegion: Region,
): Region[] {
  const pairKey = getPairKey(originRegion, destinationRegion);

  if (pairKey === "Europe|Oceania") {
    return ["Middle East", "Asia"];
  }

  if (pairKey === "North America|Oceania") {
    return ["Asia", "North America"];
  }

  if (pairKey === "Asia|South America") {
    return ["North America", "Europe"];
  }

  if (pairKey === "Africa|Oceania") {
    return ["Middle East", "Asia"];
  }

  if (pairKey === "Asia|Middle East") {
    return ["Middle East", "Asia"];
  }

  if (pairKey === "Europe|North America") {
    return ["Europe", "North America"];
  }

  return [originRegion, destinationRegion];
}

function resolveHub(code: string) {
  return airportsByCode.get(code);
}

function getLayoverAirports(
  random: () => number,
  origin: AirportRecord,
  destination: AirportRecord,
  stops: number,
) {
  const hubRegions = getHubRegionsForRoute(origin.region, destination.region);
  const candidateCodes = hubRegions.flatMap((region) => hubsByRegion[region]);
  const candidates = candidateCodes
    .map(resolveHub)
    .filter((airport): airport is AirportRecord => Boolean(airport))
    .filter(
      (airport) =>
        airport.iata !== origin.iata && airport.iata !== destination.iata,
    );

  return sampleWithoutReplacement(random, candidates, stops);
}

function getDirectDurationMinutes(
  random: () => number,
  category: RouteCategory,
  origin: AirportRecord,
  destination: AirportRecord,
) {
  const [minMinutes, maxMinutes] = categoryProfiles[category].directMinutes;
  const timezoneDelta =
    Math.abs(origin.timezone.localeCompare(destination.timezone)) % 35;
  const duration =
    minMinutes +
    Math.round((maxMinutes - minMinutes) * random()) +
    timezoneDelta;

  return Math.max(minMinutes, Math.min(duration, maxMinutes + 35));
}

function buildSegmentDurations(
  random: () => number,
  totalFlightMinutes: number,
  segmentCount: number,
) {
  if (segmentCount === 1) {
    return [totalFlightMinutes];
  }

  const weights = Array.from(
    { length: segmentCount },
    () => 0.8 + random() * 0.7,
  );
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const rawDurations = weights.map((weight) =>
    Math.round((weight / weightTotal) * totalFlightMinutes),
  );
  const normalized = [...rawDurations];
  const currentTotal = normalized.reduce((sum, minutes) => sum + minutes, 0);
  normalized[normalized.length - 1] = Math.max(
    55,
    normalized[normalized.length - 1]! + (totalFlightMinutes - currentTotal),
  );

  return normalized;
}

function buildSegments(
  random: () => number,
  departureDate: string,
  airportsInOrder: AirportRecord[],
  airline: Airline,
  category: RouteCategory,
  itineraryIndex: number,
  direction: "outbound" | "inbound",
) {
  const segmentCount = airportsInOrder.length - 1;
  const baseDirectMinutes = getDirectDurationMinutes(
    random,
    category,
    airportsInOrder[0]!,
    airportsInOrder[airportsInOrder.length - 1]!,
  );
  const detourMinutes =
    segmentCount === 1 ? 0 : segmentCount * randomInt(random, 30, 75);
  const totalFlightMinutes = baseDirectMinutes + detourMinutes;
  const flightMinutes = buildSegmentDurations(
    random,
    totalFlightMinutes,
    segmentCount,
  );
  const layovers = Array.from({ length: Math.max(0, segmentCount - 1) }, () =>
    randomInt(random, 65, category === "intra" ? 95 : 165),
  );

  const start = new Date(`${departureDate}T00:00:00.000Z`);
  const departureHourOffset = direction === "outbound" ? 5 : 8;
  start.setUTCHours(
    departureHourOffset + itineraryIndex * 1 + randomInt(random, 0, 5),
    pickRandom(random, [0, 10, 20, 30, 40, 50]),
    0,
    0,
  );

  let cursor = start.getTime();

  return flightMinutes.map((duration, index) => {
    const departureAirport = airportsInOrder[index]!;
    const arrivalAirport = airportsInOrder[index + 1]!;
    const departureTime = new Date(cursor).toISOString();
    const arrivalTime = new Date(cursor + duration * 60_000).toISOString();
    const flightNumber = `${airline.code}${randomInt(random, 101, 4899)}`;
    const aircraft = pickRandom(random, aircraftByCategory[category]);

    cursor += duration * 60_000;

    if (index < layovers.length) {
      cursor += layovers[index]! * 60_000;
    }

    return {
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      duration,
      flightNumber,
      aircraft,
    } satisfies FlightSegment;
  });
}

function getItineraryDuration(segments: FlightSegment[]) {
  if (segments.length === 0) {
    return 0;
  }

  const departure = new Date(segments[0]!.departureTime).getTime();
  const arrival = new Date(
    segments[segments.length - 1]!.arrivalTime,
  ).getTime();
  return Math.round((arrival - departure) / 60_000);
}

function buildPrice(
  random: () => number,
  category: RouteCategory,
  cabin: CabinClass,
  isRoundTrip: boolean,
) {
  const [minFare, maxFare] = categoryProfiles[category].baseFare;
  const base = minFare + Math.round((maxFare - minFare) * random());
  const cabinAdjusted = Math.round(base * cabinPriceMultiplier[cabin]);
  const roundTripMultiplier = isRoundTrip ? 1.78 : 1;
  const demandDelta = 0.92 + random() * 0.24;

  return Math.round(cabinAdjusted * roundTripMultiplier * demandDelta);
}

function buildItinerary(
  random: () => number,
  origin: AirportRecord,
  destination: AirportRecord,
  date: string,
  cabin: CabinClass,
  isRoundTrip: boolean,
  stops: number,
  index: number,
) {
  const category = getRouteCategory(origin, destination);
  const airline = pickRandom(random, getAirlinePool(origin, destination));
  const layovers = getLayoverAirports(random, origin, destination, stops);
  const outboundAirports = [origin, ...layovers, destination];
  const outbound = buildSegments(
    random,
    date,
    outboundAirports,
    airline,
    category,
    index,
    "outbound",
  );

  let inbound: FlightSegment[] | undefined;

  if (isRoundTrip) {
    const returnDate = new Date(`${date}T00:00:00.000Z`);
    returnDate.setUTCDate(returnDate.getUTCDate() + 4 + (index % 6));
    const inboundAirports = [destination, ...[...layovers].reverse(), origin];

    inbound = buildSegments(
      random,
      returnDate.toISOString().slice(0, 10),
      inboundAirports,
      airline,
      category,
      index,
      "inbound",
    );
  }

  return {
    id: `${origin.iata}-${destination.iata}-${date}-${index + 1}`,
    outbound,
    inbound,
    stops,
    totalDuration:
      getItineraryDuration(outbound) +
      (inbound ? getItineraryDuration(inbound) : 0),
    price: buildPrice(random, category, cabin, isRoundTrip),
    airline,
    cabinClass: cabin,
    baggageAllowance: baggageAllowanceByCabin[cabin],
    isRoundTrip,
  } satisfies Flight;
}

const SESSION_SALT = performance.timeOrigin.toString(36);

export function generateFlightsForRoute(
  origin: string | Airport,
  destination: string | Airport,
  date: string,
  cabin: CabinClass,
  isRoundTrip: boolean,
) {
  const resolvedOrigin = resolveAirport(origin);
  const resolvedDestination = resolveAirport(destination);

  if (resolvedOrigin.iata === resolvedDestination.iata) {
    return [];
  }

  const seed = xmur3(
    `${resolvedOrigin.iata}:${resolvedDestination.iata}:${date}:${cabin}:${isRoundTrip}:${SESSION_SALT}`,
  )();
  const random = mulberry32(seed);
  const stopPattern = [
    ...Array.from({ length: 5 }, () => 0),
    ...Array.from({ length: 10 }, () => 1),
    ...Array.from({ length: 5 }, () => 2),
  ];

  return stopPattern.map((stops, index) =>
    buildItinerary(
      random,
      resolvedOrigin,
      resolvedDestination,
      date,
      cabin,
      isRoundTrip,
      stops,
      index,
    ),
  );
}

export const sampleAirportPool = airports;
