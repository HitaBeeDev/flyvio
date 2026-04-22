import { http, HttpResponse } from 'msw'
import type { Booking } from '@/types'
import { bookings } from '@/mocks/data/bookings'
import { flights } from '@/mocks/data/flights'

export const bookingHandlers = [
  http.get('/api/bookings/:bookingId', ({ params }) => {
    const booking = bookings.find((entry) => entry.id === params.bookingId)

    if (!booking) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(booking)
  }),
  http.post('/api/bookings', async () => {
    const flight = flights[0]!
    const booking: Booking = {
      id: 'booking-006',
      confirmationCode: 'NEW7Q4',
      flight,
      passengers: [
        {
          firstName: 'Avery',
          lastName: 'Lane',
          dateOfBirth: '1992-08-16',
          passportNumber: 'XK204819',
          nationality: 'United States',
        },
      ],
      extras: {
        extraBaggage: 0,
        selectedSeats: [],
      },
      totalPrice: flight.price,
      status: 'confirmed',
      createdAt: '2026-04-22T09:30:00.000Z',
    }

    return HttpResponse.json(booking, { status: 201 })
  }),
]
