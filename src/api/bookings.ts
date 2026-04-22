import type { Booking } from '@/types'

export async function createBooking() {
  const response = await fetch('/api/bookings', { method: 'POST' })

  if (!response.ok) {
    throw new Error('Failed to create booking')
  }

  return (await response.json()) as Booking
}
