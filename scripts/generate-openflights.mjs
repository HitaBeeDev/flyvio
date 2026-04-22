import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const curatedAirlineDefinitions = [
  { code: 'AA', match: 'American Airlines' },
  { code: 'DL', match: 'Delta Air Lines' },
  { code: 'UA', match: 'United Airlines' },
  { code: 'WN', match: 'Southwest Airlines' },
  { code: 'B6', match: 'JetBlue Airways' },
  { code: 'AS', match: 'Alaska Airlines' },
  { code: 'AC', match: 'Air Canada' },
  { code: 'WS', match: 'WestJet' },
  { code: 'AM', match: 'AeroMéxico' },
  { code: 'CM', match: 'Copa Airlines' },
  { code: 'LA', match: 'LAN Airlines' },
  { code: 'AV', match: 'Avianca' },
  { code: 'AR', match: 'Aerolineas Argentinas' },
  { code: 'H2', match: 'Sky Airline' },
  { code: 'AD', match: 'Azul' },
  { code: 'LP', match: 'LAN Peru' },
  { code: 'IB', match: 'Iberia Airlines' },
  { code: 'UX', match: 'Air Europa' },
  { code: 'BA', match: 'British Airways' },
  { code: 'AF', match: 'Air France' },
  { code: 'KL', match: 'KLM Royal Dutch Airlines' },
  { code: 'LH', match: 'Lufthansa' },
  { code: 'LX', match: 'Swiss International Air Lines' },
  { code: 'OS', match: 'Austrian Airlines' },
  { code: 'TP', match: 'TAP Portugal' },
  { code: 'AY', match: 'Finnair' },
  { code: 'SK', match: 'Scandinavian Airlines System' },
  { code: 'LO', match: 'LOT Polish Airlines' },
  { code: 'AZ', match: 'Alitalia' },
  { code: 'TK', match: 'Turkish Airlines' },
  { code: 'JU', match: 'Air Serbia' },
  { code: 'A3', match: 'Aegean Airlines' },
  { code: 'RO', match: 'Tarom' },
  { code: 'MS', match: 'Egyptair' },
  { code: 'ET', match: 'Ethiopian Airlines' },
  { code: 'KQ', match: 'Kenya Airways' },
  { code: 'SA', match: 'South African Airways' },
  { code: 'AT', match: 'Royal Air Maroc' },
  { code: 'HM', match: 'Air Seychelles' },
  { code: 'QR', match: 'Qatar Airways' },
  { code: 'EK', match: 'Emirates' },
  { code: 'EY', match: 'Etihad Airways' },
  { code: 'GF', match: 'Gulf Air Bahrain' },
  { code: 'SV', match: 'Saudi Arabian Airlines' },
  { code: 'RJ', match: 'Royal Jordanian' },
  { code: 'ME', match: 'Middle East Airlines' },
  { code: 'WY', match: 'Oman Air' },
  { code: 'KU', match: 'Kuwait Airways' },
  { code: 'PK', match: 'Pakistan International Airlines' },
  { code: 'AI', match: 'Air India Limited' },
  { code: '6E', match: 'IndiGo Airlines' },
  { code: 'UK', match: 'Air Vistara' },
  { code: 'SQ', match: 'Singapore Airlines' },
  { code: 'TR', match: 'Tiger Airways' },
  { code: 'MH', match: 'Malaysia Airlines' },
  { code: 'GA', match: 'Garuda Indonesia' },
  { code: 'TG', match: 'Thai Airways International' },
  { code: 'VN', match: 'Vietnam Airlines' },
  { code: 'CX', match: 'Cathay Pacific' },
  { code: 'JL', match: 'Japan Airlines' },
  { code: 'NH', match: 'All Nippon Airways' },
  { code: 'KE', match: 'Korean Air' },
  { code: 'OZ', match: 'Asiana Airlines' },
  { code: 'CA', match: 'Air China' },
  { code: 'MU', match: 'China Eastern Airlines' },
  { code: 'CZ', match: 'China Southern Airlines' },
  { code: 'HU', match: 'Hainan Airlines' },
  { code: 'MF', match: 'Xiamen Airlines' },
  { code: 'BI', match: 'Royal Brunei Airlines' },
  { code: 'PR', match: 'Philippine Airlines' },
  { code: 'CI', match: 'China Airlines' },
  { code: 'QF', match: 'Qantas' },
  { code: 'JQ', match: 'Jetstar Airways' },
  { code: 'VA', match: 'Virgin Australia' },
  { code: 'NZ', match: 'Air New Zealand' },
  { code: 'FJ', match: 'Air Pacific' },
  { code: 'PX', match: 'Air Niugini' },
  { code: 'TN', match: 'Air Tahiti Nui' },
  { code: 'SB', match: 'Air Caledonie International' },
  { code: 'NF', match: 'Air Vanuatu' },
]

const recentAirportPatches = [
  {
    iata: 'BER',
    city: 'Berlin',
    country: 'Germany',
    name: 'Berlin Brandenburg Airport',
    timezone: 'Europe/Berlin',
  },
  {
    iata: 'IST',
    city: 'Istanbul',
    country: 'Turkey',
    name: 'Istanbul Airport',
    timezone: 'Europe/Istanbul',
  },
  {
    iata: 'PKX',
    city: 'Beijing',
    country: 'China',
    name: 'Beijing Daxing International Airport',
    timezone: 'Asia/Shanghai',
  },
]

function parseDatLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (char === '"') {
      const next = line[index + 1]

      if (inQuotes && next === '"') {
        current += '"'
        index += 1
        continue
      }

      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values.map((value) => (value === '\\N' ? '' : value))
}

function hasAirportIataCode(code) {
  return /^[A-Z]{3}$/.test(code)
}

function hasAirlineIataCode(code) {
  return /^[A-Z0-9]{2}$/.test(code)
}

function sortByAirportCode(left, right) {
  return left.iata.localeCompare(right.iata)
}

function sortByAirlineCode(left, right) {
  return left.code.localeCompare(right.code)
}

function parseAirports(contents) {
  const records = contents
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseDatLine)
    .filter((fields) => fields.length >= 12)
    .map((fields) => {
      const [, name, city, country, iata, , , , , , , timezone] = fields

      return {
        iata,
        city,
        country,
        name,
        timezone,
      }
    })
    .filter((airport) => hasAirportIataCode(airport.iata) && Boolean(airport.timezone))

  const airportMap = new Map(records.map((airport) => [airport.iata, airport]))

  for (const airport of recentAirportPatches) {
    airportMap.set(airport.iata, airport)
  }

  return Array.from(airportMap.values()).sort(sortByAirportCode)
}

function parseAirlines(contents) {
  const records = contents
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseDatLine)
    .filter((fields) => fields.length >= 8)
    .map((fields) => {
      const [, name, , code, , , , active] = fields

      return {
        code,
        name,
        active,
      }
    })
    .filter((airline) => airline.active === 'Y' && hasAirlineIataCode(airline.code))

  const curated = curatedAirlineDefinitions.map(({ code, match }) => {
    const airline = records.find(
      (record) => record.code === code && record.name.toLowerCase().includes(match.toLowerCase()),
    )

    if (!airline) {
      throw new Error(`Missing curated airline ${code} (${match}) in OpenFlights dataset`)
    }

    return {
      code: airline.code,
      name: airline.name,
      logoUrl: `https://placehold.co/96x96/png?text=${airline.code}`,
    }
  })

  return curated.sort(sortByAirlineCode)
}

async function main() {
  const [airportsPath, airlinesPath, outputDir = 'src/data'] = process.argv.slice(2)

  if (!airportsPath || !airlinesPath) {
    throw new Error(
      'Usage: node scripts/generate-openflights.mjs <airports.dat> <airlines.dat> [outputDir]',
    )
  }

  const [airportsContents, airlinesContents] = await Promise.all([
    readFile(airportsPath, 'utf8'),
    readFile(airlinesPath, 'utf8'),
  ])

  const airports = parseAirports(airportsContents)
  const airlines = parseAirlines(airlinesContents)
  const resolvedOutputDir = path.resolve(outputDir)

  await mkdir(resolvedOutputDir, { recursive: true })
  await Promise.all([
    writeFile(
      path.join(resolvedOutputDir, 'airports.json'),
      `${JSON.stringify(airports, null, 2)}\n`,
    ),
    writeFile(
      path.join(resolvedOutputDir, 'airlines.json'),
      `${JSON.stringify(airlines, null, 2)}\n`,
    ),
  ])

  process.stdout.write(
    `Generated ${airports.length} airports and ${airlines.length} airlines in ${resolvedOutputDir}\n`,
  )
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
