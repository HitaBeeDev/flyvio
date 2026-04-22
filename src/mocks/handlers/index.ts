import { bookingHandlers } from '@/mocks/handlers/bookings'
import { destinationHandlers } from '@/mocks/handlers/destinations'
import { flightHandlers } from '@/mocks/handlers/flights'

export const handlers = [
  ...flightHandlers,
  ...bookingHandlers,
  ...destinationHandlers,
]
