import airlineData from '@/data/airlines.json'
import { inferRegion } from '@/data/airports'
import type { Airline } from '@/types/travel'

type RawAirline = Omit<Airline, 'region'>

const records = airlineData as RawAirline[]

export const airlines: Airline[] = records.map((airline) => ({
  ...airline,
  region: airline.country ? inferRegion(airline.country, 'UTC') : 'global',
}))

export const airlinesByCode = new Map(airlines.map((airline) => [airline.code, airline]))
