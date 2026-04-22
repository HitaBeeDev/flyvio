import { requestJson } from '@/api/client'
import { ApiError } from '@/api/errors'
import type { Booking, CreateBookingPayload } from '@/types'

export async function createBooking(data: CreateBookingPayload): Promise<Booking> {
  const booking = await requestJson<Booking>('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!booking) {
    throw new ApiError(500, 'Booking creation returned no data.')
  }

  return booking
}

export async function getBooking(id: string): Promise<Booking | null> {
  return requestJson<Booking>(`/api/bookings/${id}`)
}
