import { bookings as seededBookings } from '@/data/bookings'
import { ApiError } from '@/api/errors'
import { getFlight } from '@/api/flights'
import { calculateBookingPrice, generateConfirmationCode } from '@/components/features/booking/booking-utils'
import type { Booking, CreateBookingPayload } from '@/types'

const bookings = new Map(seededBookings.map((booking) => [booking.id, booking]))
let bookingSequence = seededBookings.length + 1000

export async function createBooking(data: CreateBookingPayload): Promise<Booking> {
  const flight = await getFlight(data.flightId)

  if (!flight) {
    throw new ApiError(404, 'Selected flight was not found.')
  }

  const price = calculateBookingPrice(
    flight,
    data.extras,
    data.passengers.length,
  )

  const booking: Booking = {
    id: `bk-${bookingSequence}`,
    confirmationCode: generateConfirmationCode(),
    flight,
    passengers: data.passengers,
    extras: data.extras,
    totalPrice: price.total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  bookings.set(booking.id, booking)
  bookingSequence += 1

  return booking
}

export async function getBooking(id: string): Promise<Booking | null> {
  return bookings.get(id) ?? null
}
