import { airlines } from '@/data/airlines'
import { airports, airportsByCode } from '@/data/airports'
import type { Airline, Airport, CabinClass, Flight } from '@/types/travel'

const aircraftByHaul = {
  short: ['Airbus A220-300', 'Airbus A320neo', 'Boeing 737 MAX 8', 'Embraer E195-E2'],
  medium: ['Airbus A321neo', 'Boeing 737-900ER', 'Airbus A330-200', 'Boeing 787-8'],
  long: ['Airbus A350-900', 'Boeing 787-9', 'Boeing 777-300ER', 'Airbus A330-900neo'],
} as const

interface GenerateFlightsForRouteOptions {
  origin: string | Airport
  destination: string | Airport
  departureDate: string
  limit?: number
}

function xmur3(value: string) {
  let hash = 1779033703 ^ value.length

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }

  return function nextHash() {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    return (hash ^= hash >>> 16) >>> 0
  }
}

function mulberry32(seed: number) {
  return function random() {
    let next = (seed += 0x6d2b79f5)
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

function randomInt(random: () => number, min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min
}

function pickRandom<T>(random: () => number, values: T[]) {
  return values[Math.floor(random() * values.length)]!
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceKm(origin: Airport, destination: Airport) {
  const earthRadiusKm = 6371
  const latitudeDelta = toRadians(destination.latitude - origin.latitude)
  const longitudeDelta = toRadians(destination.longitude - origin.longitude)
  const latitudeA = toRadians(origin.latitude)
  const latitudeB = toRadians(destination.latitude)
  const root =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2

  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(root), Math.sqrt(1 - root)))
}

function resolveAirport(airport: string | Airport) {
  if (typeof airport !== 'string') {
    return airport
  }

  const resolvedAirport = airportsByCode.get(airport.toUpperCase())

  if (!resolvedAirport) {
    throw new Error(`Unknown airport code: ${airport}`)
  }

  return resolvedAirport
}

function getStops(random: () => number, distanceKm: number) {
  if (distanceKm < 1200) {
    return random() < 0.88 ? 0 : 1
  }

  if (distanceKm < 4500) {
    return random() < 0.62 ? 0 : 1
  }

  return random() < 0.4 ? 0 : random() < 0.9 ? 1 : 2
}

function getAirlineWeight(airline: Airline, origin: Airport, destination: Airport) {
  if (airline.country === origin.country || airline.country === destination.country) {
    return 6
  }

  if (airline.region === origin.region || airline.region === destination.region) {
    return 3
  }

  return airline.region === 'global' ? 2 : 1
}

function buildAirlinePool(origin: Airport, destination: Airport) {
  const prioritized = airlines.filter(
    (airline) =>
      airline.country === origin.country ||
      airline.country === destination.country ||
      airline.region === origin.region ||
      airline.region === destination.region,
  )

  return (prioritized.length > 0 ? prioritized : airlines).map((airline) => ({
    airline,
    weight: getAirlineWeight(airline, origin, destination),
  }))
}

function pickWeightedAirline(
  random: () => number,
  pool: Array<{ airline: Airline; weight: number }>,
  usedAirlineCodes: Set<string>,
) {
  const available = pool.filter(({ airline }) => !usedAirlineCodes.has(airline.code))
  const candidatePool = available.length > 0 ? available : pool
  const totalWeight = candidatePool.reduce((sum, entry) => sum + entry.weight, 0)
  let target = random() * totalWeight

  for (const entry of candidatePool) {
    target -= entry.weight

    if (target <= 0) {
      return entry.airline
    }
  }

  return candidatePool[candidatePool.length - 1]!.airline
}

function getHaul(distanceKm: number) {
  if (distanceKm < 1500) {
    return 'short'
  }

  if (distanceKm < 5000) {
    return 'medium'
  }

  return 'long'
}

function getTiming(distanceKm: number, stops: number, random: () => number) {
  const cruiseSpeedKmh = distanceKm < 1500 ? 690 : distanceKm < 5000 ? 790 : 860
  const airborneMinutes = (distanceKm / cruiseSpeedKmh) * 60
  const bufferMinutes = 35 + randomInt(random, 10, 35)
  const layoverMinutes = stops === 0 ? 0 : stops * randomInt(random, 55, 105)

  return {
    durationMinutes: Math.round(airborneMinutes + bufferMinutes + layoverMinutes),
    layoverMinutes,
  }
}

function getPriceMultiplier(cabinClass: CabinClass) {
  switch (cabinClass) {
    case 'economy':
      return 1
    case 'premium-economy':
      return 1.55
    case 'business':
      return 2.7
    case 'first':
      return 4.4
  }
}

function buildPriceMap(distanceKm: number, stops: number, random: () => number): Flight['prices'] {
  const distanceFactor = Math.max(69, distanceKm * 0.115)
  const stopFactor = stops === 0 ? 1.12 : 0.94
  const demandFactor = 0.92 + random() * 0.28
  const basePrice = Math.round(distanceFactor * stopFactor * demandFactor)
  const cabins: CabinClass[] = ['economy', 'premium-economy', 'business', 'first']

  return cabins.reduce(
    (prices, cabinClass) => ({
      ...prices,
      [cabinClass]: Math.round(basePrice * getPriceMultiplier(cabinClass)),
    }),
    {
      economy: 0,
      'premium-economy': 0,
      business: 0,
      first: 0,
    },
  )
}

function buildSchedule(
  departureDate: string,
  index: number,
  durationMinutes: number,
  random: () => number,
) {
  const departure = new Date(`${departureDate}T00:00:00Z`)
  const departureHour = 5 + index * 2 + randomInt(random, 0, 2)
  const departureMinute = pickRandom(random, [0, 10, 20, 30, 40, 50])

  departure.setUTCHours(departureHour, departureMinute, 0, 0)

  const arrival = new Date(departure.getTime() + durationMinutes * 60_000)

  return {
    departureTime: departure.toISOString(),
    arrivalTime: arrival.toISOString(),
  }
}

export function generateFlightsForRoute({
  origin,
  destination,
  departureDate,
  limit = 8,
}: GenerateFlightsForRouteOptions): Flight[] {
  const resolvedOrigin = resolveAirport(origin)
  const resolvedDestination = resolveAirport(destination)

  if (resolvedOrigin.code === resolvedDestination.code) {
    return []
  }

  const seed = xmur3(
    `${resolvedOrigin.code}:${resolvedDestination.code}:${departureDate}:${limit}`,
  )()
  const random = mulberry32(seed)
  const distanceKm = getDistanceKm(resolvedOrigin, resolvedDestination)
  const haul = getHaul(distanceKm)
  const airlinePool = buildAirlinePool(resolvedOrigin, resolvedDestination)
  const usedAirlineCodes = new Set<string>()

  return Array.from({ length: limit }, (_, index) => {
    const stops = getStops(random, distanceKm)
    const timing = getTiming(distanceKm, stops, random)
    const airline = pickWeightedAirline(random, airlinePool, usedAirlineCodes)
    const aircraft = pickRandom(random, [...aircraftByHaul[haul]])
    const schedule = buildSchedule(departureDate, index, timing.durationMinutes, random)
    const flightNumber = `${airline.code}${randomInt(random, 101, 4899)}`

    usedAirlineCodes.add(airline.code)

    return {
      id: `${resolvedOrigin.code}-${resolvedDestination.code}-${departureDate}-${index + 1}`,
      flightNumber,
      airline,
      origin: resolvedOrigin,
      destination: resolvedDestination,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      durationMinutes: timing.durationMinutes,
      distanceKm,
      stops,
      layoverMinutes: timing.layoverMinutes,
      aircraft,
      prices: buildPriceMap(distanceKm, stops, random),
      currency: 'USD',
    }
  })
}

export const featuredRoutes = [
  ['JFK', 'LHR'],
  ['SFO', 'HND'],
  ['BER', 'IST'],
  ['DXB', 'SIN'],
  ['SYD', 'LAX'],
] as const satisfies ReadonlyArray<readonly [string, string]>

export const flightSeedAirports = airports
