import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/api/errors'
import { getBooking } from '@/api/bookings'

const BOOKING_STALE_TIME_MS = 5 * 60 * 1000

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const booking = await getBooking(id)

      if (!booking) {
        throw new ApiError(404, 'Booking not found.')
      }

      return booking
    },
    enabled: id.length > 0,
    staleTime: BOOKING_STALE_TIME_MS,
    retry: 1,
  })
}
