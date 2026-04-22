import type { Booking } from '@/types'
import { flights } from '@/mocks/data/flights'

function bookingFlight(index: number) {
  return flights[index]!
}

export const bookings: Booking[] = [
  {
    id: 'booking-001',
    confirmationCode: 'TK4J9M',
    flight: bookingFlight(3),
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
    totalPrice: bookingFlight(3).price,
    status: 'confirmed',
    createdAt: '2026-03-18T10:12:00.000Z',
  },
  {
    id: 'booking-002',
    confirmationCode: 'LH7Q2P',
    flight: bookingFlight(17),
    passengers: [
      {
        firstName: 'Mina',
        lastName: 'Aksoy',
        dateOfBirth: '1988-11-02',
        passportNumber: 'TR938201',
        nationality: 'Turkey',
      },
      {
        firstName: 'Kerem',
        lastName: 'Aksoy',
        dateOfBirth: '1986-06-21',
        passportNumber: 'TR912774',
        nationality: 'Turkey',
      },
    ],
    extras: {
      extraBaggage: 1,
      selectedSeats: [
        { flightSegmentId: 'flight-018-outbound-0', seatCode: '12A', seatType: 'window' },
        { flightSegmentId: 'flight-018-outbound-0', seatCode: '12B', seatType: 'middle' },
      ],
    },
    totalPrice: bookingFlight(17).price + 90,
    status: 'confirmed',
    createdAt: '2026-02-04T15:45:00.000Z',
  },
  {
    id: 'booking-003',
    confirmationCode: 'BA8W6R',
    flight: bookingFlight(42),
    passengers: [
      {
        firstName: 'Nora',
        lastName: 'Sullivan',
        dateOfBirth: '1995-01-12',
        passportNumber: 'US772903',
        nationality: 'United States',
      },
    ],
    extras: {
      extraBaggage: 0,
      selectedSeats: [{ flightSegmentId: 'flight-043-outbound-0', seatCode: '3K', seatType: 'window' }],
    },
    totalPrice: bookingFlight(42).price,
    status: 'confirmed',
    createdAt: '2026-01-28T08:05:00.000Z',
  },
  {
    id: 'booking-004',
    confirmationCode: 'QR3N8C',
    flight: bookingFlight(71),
    passengers: [
      {
        firstName: 'Rafael',
        lastName: 'Moraes',
        dateOfBirth: '1990-05-30',
        passportNumber: 'BR554901',
        nationality: 'Brazil',
      },
      {
        firstName: 'Bianca',
        lastName: 'Moraes',
        dateOfBirth: '1994-10-14',
        passportNumber: 'BR554955',
        nationality: 'Brazil',
      },
      {
        firstName: 'Lia',
        lastName: 'Moraes',
        dateOfBirth: '2018-07-09',
        passportNumber: 'BR554998',
        nationality: 'Brazil',
      },
    ],
    extras: {
      extraBaggage: 2,
      selectedSeats: [],
    },
    totalPrice: bookingFlight(71).price + 160,
    status: 'confirmed',
    createdAt: '2026-04-02T19:20:00.000Z',
  },
  {
    id: 'booking-005',
    confirmationCode: 'SQ5D1X',
    flight: bookingFlight(88),
    passengers: [
      {
        firstName: 'Haruto',
        lastName: 'Sato',
        dateOfBirth: '1984-09-05',
        passportNumber: 'JP105642',
        nationality: 'Japan',
      },
    ],
    extras: {
      extraBaggage: 1,
      selectedSeats: [{ flightSegmentId: 'flight-089-inbound-1', seatCode: '7A', seatType: 'window' }],
    },
    totalPrice: bookingFlight(88).price + 45,
    status: 'confirmed',
    createdAt: '2026-04-11T06:55:00.000Z',
  },
]
