import type { Flight } from '@/types'
import { airlines } from '@/mocks/data/airlines'
import { airports } from '@/mocks/data/airports'

export const flights: Flight[] = [
  {
    id: 'flight-101',
    stops: 0,
    totalDuration: 380,
    price: 624,
    airline: airlines[0],
    cabinClass: 'Economy',
    baggageAllowance: '1 checked bag, 1 cabin bag',
    isRoundTrip: false,
    outbound: [
      {
        departureAirport: airports[0],
        arrivalAirport: airports[1],
        departureTime: '2026-05-10T08:15:00.000Z',
        arrivalTime: '2026-05-10T14:35:00.000Z',
        duration: 380,
        flightNumber: 'SQ 101',
        aircraft: 'Airbus A350-900',
      },
    ],
  },
]
