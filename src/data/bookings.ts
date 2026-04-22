import { generateFlightsForRoute } from '@/data/flights'
import type { Booking, Passenger } from '@/types/travel'

function getPassengers(...names: Array<[string, string]>): Passenger[] {
  return names.map(([firstName, lastName], index) => ({
    id: `pax-${index + 1}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    firstName,
    lastName,
  }))
}

function getSeedFlight(origin: string, destination: string, departureDate: string, index: number) {
  return generateFlightsForRoute({ origin, destination, departureDate, limit: 5 })[index]
}

export const bookings: Booking[] = [
  {
    id: 'bk-1001',
    confirmationCode: 'SQ7K2M',
    status: 'confirmed',
    bookedAt: '2026-03-02T10:15:00Z',
    flight: getSeedFlight('JFK', 'LHR', '2026-06-18', 0)!,
    passengers: getPassengers(['Anahita', 'Karimi'], ['Noah', 'Karimi']),
    primaryContact: {
      email: 'anahita@example.com',
      phone: '+1-646-555-0182',
    },
  },
  {
    id: 'bk-1002',
    confirmationCode: 'QP4D8R',
    status: 'ticketed',
    bookedAt: '2026-02-14T17:40:00Z',
    flight: getSeedFlight('BER', 'IST', '2026-05-09', 1)!,
    passengers: getPassengers(['Mila', 'Fischer']),
    primaryContact: {
      email: 'mila.fischer@example.com',
      phone: '+49-30-5550-1924',
    },
  },
  {
    id: 'bk-1003',
    confirmationCode: 'LW9N3C',
    status: 'check-in-open',
    bookedAt: '2026-01-29T08:05:00Z',
    flight: getSeedFlight('SFO', 'HND', '2026-04-27', 2)!,
    passengers: getPassengers(['Daniel', 'Park']),
    primaryContact: {
      email: 'daniel.park@example.com',
      phone: '+1-415-555-0198',
    },
  },
  {
    id: 'bk-1004',
    confirmationCode: 'TY6H1B',
    status: 'confirmed',
    bookedAt: '2026-03-11T13:30:00Z',
    flight: getSeedFlight('DXB', 'SIN', '2026-07-03', 0)!,
    passengers: getPassengers(['Layla', 'Haddad'], ['Yousef', 'Haddad']),
    primaryContact: {
      email: 'layla.haddad@example.com',
      phone: '+971-4-555-0177',
    },
  },
  {
    id: 'bk-1005',
    confirmationCode: 'VC2X5P',
    status: 'ticketed',
    bookedAt: '2026-02-03T21:12:00Z',
    flight: getSeedFlight('SYD', 'LAX', '2026-08-21', 3)!,
    passengers: getPassengers(['Sophie', 'Nguyen']),
    primaryContact: {
      email: 'sophie.nguyen@example.com',
      phone: '+61-2-5550-1620',
    },
  },
]
