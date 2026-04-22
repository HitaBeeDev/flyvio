import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

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

function toNumber(value) {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function hasAirportIataCode(code) {
  return /^[A-Z]{3}$/.test(code)
}

function hasAirlineIataCode(code) {
  return /^[A-Z0-9]{2}$/.test(code)
}

function sortByCodeThenName(left, right) {
  return left.code.localeCompare(right.code) || left.name.localeCompare(right.name)
}

function parseAirports(contents) {
  return contents
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseDatLine)
    .filter((fields) => fields.length >= 12)
    .map((fields) => {
      const [
        id,
        name,
        city,
        country,
        code,
        icao,
        latitude,
        longitude,
        altitude,
        utcOffset,
        daylightSavingZone,
        timezone,
      ] = fields

      return {
        id: toNumber(id),
        name,
        city,
        country,
        code,
        icao: icao || null,
        latitude: toNumber(latitude),
        longitude: toNumber(longitude),
        altitude: toNumber(altitude),
        utcOffset: toNumber(utcOffset),
        daylightSavingZone: daylightSavingZone || null,
        timezone: timezone || 'UTC',
      }
    })
    .filter(
      (airport) =>
        airport.id !== null &&
        airport.latitude !== null &&
        airport.longitude !== null &&
        hasAirportIataCode(airport.code),
    )
    .sort(sortByCodeThenName)
}

function parseAirlines(contents) {
  return contents
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseDatLine)
    .filter((fields) => fields.length >= 8)
    .map((fields) => {
      const [id, name, alias, code, icao, callsign, country, active] = fields

      return {
        id: toNumber(id),
        name,
        alias: alias || null,
        code,
        icao: icao || null,
        callsign: callsign || null,
        country: country || null,
        active,
      }
    })
    .filter(
      (airline) =>
        airline.id !== null &&
        airline.active === 'Y' &&
        hasAirlineIataCode(airline.code),
    )
    .map(({ active, ...airline }) => airline)
    .sort(sortByCodeThenName)
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
