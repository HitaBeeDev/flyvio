import { http, HttpResponse } from 'msw'
import type { Booking } from '@/types'

export const bookingHandlers = [
  http.post('/api/bookings', async () => {
    const booking: Booking = {
      id: 'booking-001',
      flightId: 'flight-101',
      passengers: 1,
      totalPrice: 624,
      status: 'confirmed',
    }

    return HttpResponse.json(booking, { status: 201 })
  }),
]
