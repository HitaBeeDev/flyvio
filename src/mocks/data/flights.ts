import type { Airline, Airport, CabinClass, Flight, FlightSegment } from '@/types'
import { airlines } from '@/mocks/data/airlines'
import { airports } from '@/mocks/data/airports'

type Region =
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Asia'
  | 'Middle East'
  | 'Africa'
  | 'Oceania'

type RouteCategory = 'short-haul' | 'transatlantic' | 'long-haul' | 'regional-long'

type RouteTemplate = {
  origin: string
  destination: string
}

const SHORT_HAUL_ROUTES: RouteTemplate[] = [
  { origin: 'IST', destination: 'ATH' },
  { origin: 'IST', destination: 'VIE' },
  { origin: 'LHR', destination: 'CDG' },
  { origin: 'AMS', destination: 'BCN' },
  { origin: 'FCO', destination: 'MUC' },
  { origin: 'MAD', destination: 'LIS' },
  { origin: 'DUB', destination: 'BRU' },
  { origin: 'ZRH', destination: 'VIE' },
  { origin: 'JFK', destination: 'ORD' },
  { origin: 'LAX', destination: 'SFO' },
  { origin: 'MIA', destination: 'ATL' },
  { origin: 'SIN', destination: 'KUL' },
  { origin: 'HKG', destination: 'BKK' },
  { origin: 'NRT', destination: 'ICN' },
  { origin: 'SYD', destination: 'MEL' },
  { origin: 'GRU', destination: 'EZE' },
]

const TRANSATLANTIC_ROUTES: RouteTemplate[] = [
  { origin: 'JFK', destination: 'LHR' },
  { origin: 'JFK', destination: 'CDG' },
  { origin: 'BOS', destination: 'DUB' },
  { origin: 'ORD', destination: 'MAD' },
  { origin: 'MIA', destination: 'BCN' },
  { origin: 'YYZ', destination: 'AMS' },
  { origin: 'LAX', destination: 'LHR' },
  { origin: 'IAD', destination: 'BRU' },
]

const LONG_HAUL_ROUTES: RouteTemplate[] = [
  { origin: 'SIN', destination: 'DXB' },
  { origin: 'NRT', destination: 'DOH' },
  { origin: 'SYD', destination: 'SIN' },
  { origin: 'MEL', destination: 'HKG' },
  { origin: 'LAX', destination: 'NRT' },
  { origin: 'SFO', destination: 'SIN' },
  { origin: 'JFK', destination: 'DXB' },
  { origin: 'LHR', destination: 'SIN' },
  { origin: 'CDG', destination: 'HKG' },
  { origin: 'GRU', destination: 'LIS' },
  { origin: 'CAI', destination: 'JNB' },
  { origin: 'DXB', destination: 'SYD' },
  { origin: 'DOH', destination: 'ICN' },
  { origin: 'EZE', destination: 'MAD' },
  { origin: 'SCL', destination: 'FRA' },
]

const CABIN_CLASSES: CabinClass[] = ['Economy', 'Premium Economy', 'Business', 'First']

const AIRCRAFT_BY_CABIN: Record<CabinClass, string[]> = {
  Economy: ['Airbus A320neo', 'Boeing 737 MAX 8', 'Airbus A321neo'],
  'Premium Economy': ['Airbus A330-300', 'Boeing 787-9', 'Airbus A350-900'],
  Business: ['Boeing 787-10', 'Airbus A350-1000', 'Boeing 777-300ER'],
  First: ['Airbus A380-800', 'Boeing 777-300ER', 'Airbus A350-1000'],
}

const REGION_BY_AIRPORT: Record<string, Region> = {
  IST: 'Europe',
  SAW: 'Europe',
  LHR: 'Europe',
  CDG: 'Europe',
  AMS: 'Europe',
  BCN: 'Europe',
  FCO: 'Europe',
  MUC: 'Europe',
  MAD: 'Europe',
  VIE: 'Europe',
  ATH: 'Europe',
  DUB: 'Europe',
  ZRH: 'Europe',
  BRU: 'Europe',
  LIS: 'Europe',
  FRA: 'Europe',
  CPH: 'Europe',
  OSL: 'Europe',
  ARN: 'Europe',
  HEL: 'Europe',
  PRG: 'Europe',
  BUD: 'Europe',
  WAW: 'Europe',
  JFK: 'North America',
  LAX: 'North America',
  ORD: 'North America',
  MIA: 'North America',
  SFO: 'North America',
  YYZ: 'North America',
  YVR: 'North America',
  BOS: 'North America',
  SEA: 'North America',
  IAD: 'North America',
  ATL: 'North America',
  MXC: 'North America',
  SIN: 'Asia',
  HKG: 'Asia',
  NRT: 'Asia',
  BKK: 'Asia',
  ICN: 'Asia',
  KUL: 'Asia',
  DXB: 'Middle East',
  DOH: 'Middle East',
  CAI: 'Middle East',
  SYD: 'Oceania',
  MEL: 'Oceania',
  GRU: 'South America',
  EZE: 'South America',
  SCL: 'South America',
  JNB: 'Africa',
}

const HUBS_BY_REGION: Record<Region, string[]> = {
  Europe: ['IST', 'LHR', 'AMS', 'FRA', 'MUC', 'MAD'],
  'North America': ['JFK', 'ORD', 'ATL', 'YYZ', 'MIA'],
  'South America': ['GRU', 'EZE', 'SCL', 'MAD'],
  Asia: ['SIN', 'HKG', 'NRT', 'ICN', 'BKK'],
  'Middle East': ['DXB', 'DOH', 'CAI', 'IST'],
  Africa: ['CAI', 'JNB', 'DOH'],
  Oceania: ['SYD', 'MEL', 'SIN', 'HKG'],
}

const DEFAULT_CONNECTION_HUBS = ['IST', 'LHR', 'DXB', 'DOH', 'SIN', 'JFK']

const CONNECTION_HUBS: Record<string, string[]> = {
  'Europe-North America': ['LHR', 'AMS', 'DUB', 'JFK', 'BOS', 'YYZ', 'MAD'],
  'Europe-Asia': ['IST', 'DOH', 'DXB', 'VIE', 'SIN'],
  'Europe-Middle East': ['IST', 'ATH', 'CAI'],
  'North America-Asia': ['LAX', 'SFO', 'SEA', 'NRT', 'ICN'],
  'North America-Middle East': ['LHR', 'DOH', 'DXB', 'JFK'],
  'Asia-Middle East': ['DXB', 'DOH', 'SIN', 'HKG'],
  'Asia-Oceania': ['SIN', 'HKG', 'KUL', 'BKK'],
  'Europe-South America': ['MAD', 'LIS', 'GRU'],
  'Africa-Europe': ['CAI', 'FCO', 'MAD'],
  'Africa-Middle East': ['CAI', 'DOH', 'DXB'],
  default: DEFAULT_CONNECTION_HUBS,
}

const airportByIata = Object.fromEntries(airports.map((airport) => [airport.iata, airport])) as Record<string, Airport>

function createSeededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(items: readonly T[], index: number): T {
  return items[((index % items.length) + items.length) % items.length]!
}

function pickAirport(code: string): Airport {
  const airport = airportByIata[code]

  if (!airport) {
    throw new Error(`Unknown airport: ${code}`)
  }

  return airport
}

function airportRegion(code: string): Region {
  const region = REGION_BY_AIRPORT[code]

  if (!region) {
    throw new Error(`Unknown airport region: ${code}`)
  }

  return region
}

function regionKey(first: Region, second: Region) {
  return [first, second].sort().join('-')
}

function getRouteCategory(origin: string, destination: string): RouteCategory {
  const originRegion = airportRegion(origin)
  const destinationRegion = airportRegion(destination)

  if (originRegion === destinationRegion) {
    if (originRegion === 'Europe' || originRegion === 'North America' || originRegion === 'Asia') {
      return 'short-haul'
    }

    return 'regional-long'
  }

  if (
    (originRegion === 'Europe' && destinationRegion === 'North America') ||
    (originRegion === 'North America' && destinationRegion === 'Europe')
  ) {
    return 'transatlantic'
  }

  if (
    (originRegion === 'Europe' && destinationRegion === 'South America') ||
    (originRegion === 'South America' && destinationRegion === 'Europe') ||
    (originRegion === 'Africa' && destinationRegion === 'Europe') ||
    (originRegion === 'Europe' && destinationRegion === 'Africa')
  ) {
    return 'regional-long'
  }

  return 'long-haul'
}

function getCandidateHubs(origin: string, destination: string): string[] {
  const originRegion = airportRegion(origin)
  const destinationRegion = airportRegion(destination)

  if (originRegion === destinationRegion) {
    return HUBS_BY_REGION[originRegion]
  }

  return CONNECTION_HUBS[regionKey(originRegion, destinationRegion)] ?? DEFAULT_CONNECTION_HUBS
}

function uniquePath(path: string[]) {
  return path.filter((code, index) => path.indexOf(code) === index)
}

function buildPath(origin: string, destination: string, stops: number, index: number): string[] {
  if (stops === 0) {
    return [origin, destination]
  }

  const candidateHubs = getCandidateHubs(origin, destination).filter(
    (code) => code !== origin && code !== destination,
  )

  if (stops === 1) {
    const hub = pick(candidateHubs, index)
    return [origin, hub, destination]
  }

  const firstPool = [...candidateHubs, ...HUBS_BY_REGION[airportRegion(origin)]].filter(
    (code) => code !== origin && code !== destination,
  )
  const secondPool = [...candidateHubs, ...HUBS_BY_REGION[airportRegion(destination)]].filter(
    (code) => code !== origin && code !== destination,
  )

  const firstHub = pick(firstPool, index)
  const secondHub = pick(
    secondPool.filter((code) => code !== firstHub),
    index + 3,
  )

  return uniquePath([origin, firstHub, secondHub, destination])
}

function segmentDuration(origin: string, destination: string, variant: number) {
  const originRegion = airportRegion(origin)
  const destinationRegion = airportRegion(destination)
  const sameCountry = pickAirport(origin).country === pickAirport(destination).country

  if (sameCountry) {
    return 70 + (variant % 35)
  }

  if (originRegion === destinationRegion) {
    return 90 + (variant % 150)
  }

  const key = regionKey(originRegion, destinationRegion)

  switch (key) {
    case 'Europe-North America':
      return 420 + (variant % 150)
    case 'Europe-Middle East':
    case 'Asia-Middle East':
      return 240 + (variant % 120)
    case 'Asia-Oceania':
      return 360 + (variant % 150)
    case 'Europe-South America':
      return 600 + (variant % 120)
    case 'Africa-Middle East':
    case 'Africa-Europe':
      return 300 + (variant % 120)
    case 'Asia-North America':
      return 630 + (variant % 180)
    default:
      return 480 + (variant % 240)
  }
}

function segmentAircraft(cabinClass: CabinClass, variant: number) {
  return pick(AIRCRAFT_BY_CABIN[cabinClass], variant)
}

function baggageAllowance(cabinClass: CabinClass) {
  switch (cabinClass) {
    case 'Economy':
      return '1 cabin bag'
    case 'Premium Economy':
      return '1 checked bag, 1 cabin bag'
    case 'Business':
      return '2 checked bags, priority cabin bag'
    case 'First':
      return '3 checked bags, lounge access, priority cabin bag'
  }
}

function priceForFlight(category: RouteCategory, cabinClass: CabinClass, isRoundTrip: boolean, variant: number) {
  const economyBase =
    category === 'short-haul'
      ? 80 + (variant % 210)
      : category === 'transatlantic'
        ? 400 + (variant % 500)
        : category === 'regional-long'
          ? 220 + (variant % 480)
          : 600 + (variant % 800)

  const cabinMultiplier =
    cabinClass === 'Economy'
      ? 1
      : cabinClass === 'Premium Economy'
        ? 1.35
        : cabinClass === 'Business'
          ? 2.35
          : 3.1

  const roundTripMultiplier = isRoundTrip ? 1.8 : 1
  const stopDiscount = variant % 2 === 0 ? 0.96 : 1
  const price = Math.round(economyBase * cabinMultiplier * roundTripMultiplier * stopDiscount)

  return Math.max(80, Math.min(3500, price))
}

function buildSegments(
  path: string[],
  departure: Date,
  cabinClass: CabinClass,
  airline: Airline,
  variant: number,
) {
  const segments: FlightSegment[] = []
  let cursor = departure.getTime()
  let totalDuration = 0

  for (let index = 0; index < path.length - 1; index += 1) {
    const origin = path[index]!
    const destination = path[index + 1]!
    const duration = segmentDuration(origin, destination, variant + index * 11)
    const departureTime = new Date(cursor)
    const arrivalTime = new Date(cursor + duration * 60_000)

    segments.push({
      departureAirport: pickAirport(origin),
      arrivalAirport: pickAirport(destination),
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      duration,
      flightNumber: `${airline.code} ${100 + variant + index}`,
      aircraft: segmentAircraft(cabinClass, variant + index),
    })

    totalDuration += duration
    cursor = arrivalTime.getTime()

    if (index < path.length - 2) {
      const layover = 45 + ((variant + index * 17) % 46)
      totalDuration += layover
      cursor += layover * 60_000
    }
  }

  return { segments, totalDuration, lastArrival: cursor }
}

function departureDate(index: number, random: () => number) {
  const dayOffset = (index * 3) % 120
  const hour = 5 + Math.floor(random() * 16)
  const minute = Math.floor(random() * 4) * 15

  return new Date(Date.UTC(2026, 4, 1 + dayOffset, hour, minute))
}

function buildFlight(index: number, stops: number, random: () => number): Flight {
  const routePool =
    stops === 0
      ? [...SHORT_HAUL_ROUTES, ...TRANSATLANTIC_ROUTES]
      : stops === 1
        ? [...SHORT_HAUL_ROUTES, ...TRANSATLANTIC_ROUTES, ...LONG_HAUL_ROUTES]
        : [...TRANSATLANTIC_ROUTES, ...LONG_HAUL_ROUTES]

  const template = pick(routePool, index)
  const airline = pick(airlines, index + Math.floor(random() * airlines.length))
  const cabinClass = pick(CABIN_CLASSES, index + Math.floor(random() * CABIN_CLASSES.length))
  const isRoundTrip = index % 3 === 0
  const path = buildPath(template.origin, template.destination, stops, index)
  const outboundDeparture = departureDate(index, random)
  const flightId = `flight-${String(index + 1).padStart(3, '0')}`
  const outboundData = buildSegments(path, outboundDeparture, cabinClass, airline, index * 7 + 13)

  let inbound: FlightSegment[] | undefined
  let totalDuration = outboundData.totalDuration

  if (isRoundTrip) {
    const returnPath = [...path].reverse()
    const returnDeparture = new Date(outboundData.lastArrival + (2 + (index % 9)) * 24 * 60 * 60_000)
    const inboundData = buildSegments(returnPath, returnDeparture, cabinClass, airline, index * 9 + 19)
    inbound = inboundData.segments
  }

  const category = getRouteCategory(template.origin, template.destination)

  return {
    id: flightId,
    outbound: outboundData.segments,
    inbound,
    stops,
    totalDuration: Math.min(1080, totalDuration),
    price: priceForFlight(category, cabinClass, isRoundTrip, index * 23 + 41),
    airline,
    cabinClass,
    baggageAllowance: baggageAllowance(cabinClass),
    isRoundTrip,
  }
}

function generateFlights(seed: number) {
  const random = createSeededRandom(seed)

  return [
    ...Array.from({ length: 20 }, (_, index) => buildFlight(index, 0, random)),
    ...Array.from({ length: 50 }, (_, index) => buildFlight(index + 20, 1, random)),
    ...Array.from({ length: 30 }, (_, index) => buildFlight(index + 70, 2, random)),
  ]
}

export const flights: Flight[] = generateFlights(20260422)
