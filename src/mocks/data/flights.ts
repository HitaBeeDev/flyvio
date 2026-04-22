import type { Flight } from '@/types'

export const flights: Flight[] = [
  {
    id: 'flight-101',
    airlineId: 'sqx',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '2026-05-10T08:15:00.000Z',
    arrivalTime: '2026-05-10T14:35:00.000Z',
    durationMinutes: 380,
    stops: 0,
    price: 624,
    cabinClass: 'economy',
    segments: [
      {
        id: 'segment-101',
        airlineId: 'sqx',
        flightNumber: 'SQ 101',
        departureAirport: 'JFK',
        arrivalAirport: 'LHR',
        departureTime: '2026-05-10T08:15:00.000Z',
        arrivalTime: '2026-05-10T14:35:00.000Z',
        durationMinutes: 380,
      },
    ],
  },
]
