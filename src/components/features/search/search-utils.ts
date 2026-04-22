import { format } from 'date-fns'
import { airportsByCode } from '@/data/airports'
import type { CabinClass, PassengerCount, SearchParams } from '@/types'

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function getAirportLabel(code: string) {
  const airport = airportsByCode.get(code)

  if (!airport) {
    return code
  }

  return `${airport.city} (${airport.iata})`
}

export function formatPassengerSummary(
  passengers: PassengerCount,
  cabinClass: CabinClass,
) {
  const parts = [
    pluralize(passengers.adults, 'Adult'),
    passengers.children ? pluralize(passengers.children, 'Child') : null,
    passengers.infants ? pluralize(passengers.infants, 'Infant') : null,
  ].filter(Boolean)

  return `${parts.join(', ')} · ${cabinClass}`
}

export function formatWidgetDateLabel(
  departureDate?: string,
  returnDate?: string,
  isRoundTrip?: boolean,
) {
  if (!departureDate) {
    return 'Select travel dates'
  }

  const departure = format(new Date(departureDate), 'EEE, d MMM')

  if (!isRoundTrip || !returnDate) {
    return departure
  }

  return `${departure} → ${format(new Date(returnDate), 'EEE, d MMM')}`
}

export function formatSearchSummary(params: SearchParams) {
  return [
    `${getAirportLabel(params.origin)} → ${getAirportLabel(params.destination)}`,
    formatWidgetDateLabel(
      params.departureDate,
      params.returnDate,
      params.isRoundTrip,
    ),
    formatPassengerSummary(params.passengers, params.cabinClass),
  ].join(' · ')
}
