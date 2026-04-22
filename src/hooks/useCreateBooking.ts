import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createBooking } from '@/api/bookings'
import { ApiError } from '@/api/errors'
import { useBookingStore } from '@/stores/bookingStore'
import type { CreateBookingPayload } from '@/types'

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Booking could not be completed.'
}

export function useCreateBooking() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateBookingPayload) => createBooking(data),
    onSuccess: (booking) => {
      const bookingStore = useBookingStore.getState()
      bookingStore.reset()
      navigate(`/booking/confirmation/${booking.id}`)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
