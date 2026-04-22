import airportData from '@/data/airports.json'
import type { Airport, TravelRegion } from '@/types/travel'

type RawAirport = Omit<Airport, 'region'>

const northAmericaCountries = new Set([
  'Antigua and Barbuda',
  'Bahamas',
  'Barbados',
  'Belize',
  'Canada',
  'Costa Rica',
  'Cuba',
  'Dominica',
  'Dominican Republic',
  'El Salvador',
  'Grenada',
  'Guatemala',
  'Haiti',
  'Honduras',
  'Jamaica',
  'Mexico',
  'Nicaragua',
  'Panama',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Trinidad and Tobago',
  'United States',
])

const southAmericaCountries = new Set([
  'Argentina',
  'Bolivia',
  'Brazil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Guyana',
  'Paraguay',
  'Peru',
  'Suriname',
  'Uruguay',
  'Venezuela',
])

const oceaniaCountries = new Set([
  'Australia',
  'Fiji',
  'French Polynesia',
  'Kiribati',
  'Marshall Islands',
  'Micronesia',
  'Nauru',
  'New Caledonia',
  'New Zealand',
  'Palau',
  'Papua New Guinea',
  'Samoa',
  'Solomon Islands',
  'Tonga',
  'Tuvalu',
  'Vanuatu',
])

const middleEastCountries = new Set([
  'Bahrain',
  'Iran',
  'Iraq',
  'Israel',
  'Jordan',
  'Kuwait',
  'Lebanon',
  'Oman',
  'Qatar',
  'Saudi Arabia',
  'Syria',
  'Turkey',
  'United Arab Emirates',
  'Yemen',
])

const africaCountries = new Set([
  'Algeria',
  'Angola',
  'Botswana',
  'Cameroon',
  'Cape Verde',
  'Djibouti',
  'Egypt',
  'Ethiopia',
  'Ghana',
  'Kenya',
  'Madagascar',
  'Mauritius',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nigeria',
  'Rwanda',
  'Senegal',
  'Seychelles',
  'South Africa',
  'Tanzania',
  'Tunisia',
  'Uganda',
  'Zambia',
  'Zimbabwe',
])

const europeCountries = new Set([
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom',
])

const asiaCountries = new Set([
  'Bangladesh',
  'Brunei',
  'Cambodia',
  'China',
  'Hong Kong',
  'India',
  'Indonesia',
  'Japan',
  'Kazakhstan',
  'Laos',
  'Macau',
  'Malaysia',
  'Mongolia',
  'Nepal',
  'Pakistan',
  'Philippines',
  'Singapore',
  'South Korea',
  'Sri Lanka',
  'Taiwan',
  'Thailand',
  'Uzbekistan',
  'Vietnam',
])

export function inferRegion(country: string, timezone: string): Exclude<TravelRegion, 'global'> {
  if (middleEastCountries.has(country)) {
    return 'middle-east'
  }

  if (northAmericaCountries.has(country)) {
    return 'north-america'
  }

  if (southAmericaCountries.has(country)) {
    return 'south-america'
  }

  if (oceaniaCountries.has(country)) {
    return 'oceania'
  }

  if (africaCountries.has(country)) {
    return 'africa'
  }

  if (europeCountries.has(country)) {
    return 'europe'
  }

  if (asiaCountries.has(country)) {
    return 'asia'
  }

  if (timezone.startsWith('Europe/')) {
    return 'europe'
  }

  if (timezone.startsWith('Asia/')) {
    return 'asia'
  }

  if (timezone.startsWith('Africa/')) {
    return 'africa'
  }

  if (timezone.startsWith('Australia/') || timezone.startsWith('Pacific/')) {
    return 'oceania'
  }

  if (timezone.startsWith('America/')) {
    return southAmericaCountries.has(country) ? 'south-america' : 'north-america'
  }

  return 'europe'
}

const airportPatches: Record<string, RawAirport> = {
  BER: {
    id: 900001,
    name: 'Berlin Brandenburg Airport',
    city: 'Berlin',
    country: 'Germany',
    code: 'BER',
    icao: 'EDDB',
    latitude: 52.366667,
    longitude: 13.503333,
    altitude: 157,
    utcOffset: 1,
    daylightSavingZone: 'E',
    timezone: 'Europe/Berlin',
  },
  IST: {
    id: 3132,
    name: 'Istanbul Airport',
    city: 'Istanbul',
    country: 'Turkey',
    code: 'IST',
    icao: 'LTFM',
    latitude: 41.275278,
    longitude: 28.751944,
    altitude: 325,
    utcOffset: 3,
    daylightSavingZone: 'E',
    timezone: 'Europe/Istanbul',
  },
  PKX: {
    id: 8195,
    name: 'Beijing Daxing International Airport',
    city: 'Beijing',
    country: 'China',
    code: 'PKX',
    icao: 'ZBAD',
    latitude: 39.509945,
    longitude: 116.41092,
    altitude: 98,
    utcOffset: 8,
    daylightSavingZone: 'U',
    timezone: 'Asia/Shanghai',
  },
}

const records = airportData as RawAirport[]
const patchedAirportMap = new Map(records.map((airport) => [airport.code, airport]))

for (const airport of Object.values(airportPatches)) {
  patchedAirportMap.set(airport.code, airport)
}

export const airports: Airport[] = Array.from(patchedAirportMap.values())
  .map((airport) => ({
    ...airport,
    region: inferRegion(airport.country, airport.timezone),
  }))
  .sort((left, right) => left.code.localeCompare(right.code))

export const airportsByCode = new Map(airports.map((airport) => [airport.code, airport]))

function normalizeQuery(query: string) {
  return query.trim().toLowerCase()
}

function getAirportSearchScore(airport: Airport, query: string) {
  const haystacks = [
    airport.code.toLowerCase(),
    airport.name.toLowerCase(),
    airport.city.toLowerCase(),
    airport.country.toLowerCase(),
  ]

  if (airport.code.toLowerCase() === query) {
    return 100
  }

  if (airport.code.toLowerCase().startsWith(query)) {
    return 80
  }

  const exactFieldMatch = haystacks.some((value) => value === query)

  if (exactFieldMatch) {
    return 70
  }

  const prefixMatch = haystacks.some((value) => value.startsWith(query))

  if (prefixMatch) {
    return 50
  }

  const includesMatch = haystacks.some((value) => value.includes(query))
  return includesMatch ? 25 : 0
}

export function searchAirports(query: string, limit = 12): Airport[] {
  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return airports.slice(0, limit)
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
    .map(({ airport }) => airport)
}
