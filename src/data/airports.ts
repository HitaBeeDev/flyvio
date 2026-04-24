import airportData from "@/data/airports.json";
import type { Region } from "@/types";
import type { Airport } from "@/types/flight";

type AirportPatch = Airport;

export type AirportRecord = Airport & {
  region: Region;
};

const middleEastTimezones = new Set([
  "Asia/Aden",
  "Asia/Amman",
  "Asia/Baghdad",
  "Asia/Bahrain",
  "Asia/Beirut",
  "Asia/Damascus",
  "Asia/Dubai",
  "Asia/Gaza",
  "Asia/Hebron",
  "Asia/Jerusalem",
  "Asia/Kuwait",
  "Asia/Muscat",
  "Asia/Qatar",
  "Asia/Riyadh",
  "Asia/Tel_Aviv",
  "Asia/Tehran",
]);

const southAmericaTimezonePrefixes = [
  "America/Argentina",
  "America/Araguaina",
  "America/Asuncion",
  "America/Bahia",
  "America/Belem",
  "America/Boa_Vista",
  "America/Bogota",
  "America/Campo_Grande",
  "America/Caracas",
  "America/Cayenne",
  "America/Cuiaba",
  "America/Eirunepe",
  "America/Fortaleza",
  "America/Glace_Bay",
  "America/Godthab",
  "America/Goose_Bay",
  "America/Guyana",
  "America/La_Paz",
  "America/Lima",
  "America/Maceio",
  "America/Manaus",
  "America/Montevideo",
  "America/Paramaribo",
  "America/Porto_Velho",
  "America/Punta_Arenas",
  "America/Recife",
  "America/Rio_Branco",
  "America/Santiago",
  "America/Santarem",
  "America/Sao_Paulo",
  "America/Thule",
  "Atlantic/Stanley",
];

const airportPatches: Record<string, AirportPatch> = {
  BER: {
    iata: "BER",
    city: "Berlin",
    country: "Germany",
    name: "Berlin Brandenburg Airport",
    timezone: "Europe/Berlin",
  },
  IST: {
    iata: "IST",
    city: "Istanbul",
    country: "Turkey",
    name: "Istanbul Airport",
    timezone: "Europe/Istanbul",
  },
  PKX: {
    iata: "PKX",
    city: "Beijing",
    country: "China",
    name: "Beijing Daxing International Airport",
    timezone: "Asia/Shanghai",
  },
};

function isSouthAmericaTimezone(timezone: string) {
  return southAmericaTimezonePrefixes.some((prefix) =>
    timezone.startsWith(prefix),
  );
}

export function getRegionFromTimezone(timezone: string): Region {
  if (middleEastTimezones.has(timezone)) {
    return "Middle East";
  }

  if (timezone.startsWith("Africa/")) {
    return "Africa";
  }

  if (timezone.startsWith("Europe/")) {
    return "Europe";
  }

  if (timezone.startsWith("Asia/")) {
    return "Asia";
  }

  if (timezone.startsWith("Australia/") || timezone.startsWith("Pacific/")) {
    return "Oceania";
  }

  if (timezone.startsWith("America/") || timezone.startsWith("Atlantic/")) {
    return isSouthAmericaTimezone(timezone) ? "South America" : "North America";
  }

  return "Europe";
}

const patchedAirportMap = new Map(
  (airportData as Airport[]).map((airport) => [airport.iata, airport] as const),
);

for (const airport of Object.values(airportPatches)) {
  patchedAirportMap.set(airport.iata, airport);
}

export const airports: AirportRecord[] = Array.from(patchedAirportMap.values())
  .map((airport) => ({
    ...airport,
    region: getRegionFromTimezone(airport.timezone),
  }))
  .sort((left, right) => left.iata.localeCompare(right.iata));

export const airportsByCode = new Map(
  airports.map((airport) => [airport.iata, airport]),
);

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

function getAirportSearchScore(airport: AirportRecord, query: string) {
  const code = airport.iata.toLowerCase();
  const name = airport.name.toLowerCase();
  const city = airport.city.toLowerCase();

  if (code === query) {
    return 100;
  }

  if (code.startsWith(query)) {
    return 80;
  }

  if (city === query || name === query) {
    return 60;
  }

  if (city.startsWith(query) || name.startsWith(query)) {
    return 40;
  }

  if (city.includes(query) || name.includes(query)) {
    return 20;
  }

  return 0;
}

export function searchAirports(query: string, limit = 12): AirportRecord[] {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return airports.slice(0, limit);
  }

  return airports
    .map((airport) => ({
      airport,
      score: getAirportSearchScore(airport, normalizedQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.airport.city.localeCompare(right.airport.city) ||
        left.airport.name.localeCompare(right.airport.name),
    )
    .slice(0, limit)
    .map(({ airport }) => airport);
}
