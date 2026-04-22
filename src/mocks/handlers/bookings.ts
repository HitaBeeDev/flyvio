import { http, HttpResponse } from 'msw'
import type { Booking } from '@/types'
import { flights } from '@/mocks/data/flights'

export const bookingHandlers = [
  http.post('/api/bookings', async () => {
    const booking: Booking = {
      id: 'booking-001',
      confirmationCode: 'SQX9L2',
      flight: flights[0],
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
      totalPrice: 624,
      status: 'confirmed',
      createdAt: '2026-04-22T09:30:00.000Z',
    }

    return HttpResponse.json(booking, { status: 201 })
  }),
]
