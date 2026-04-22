import { useMutation } from '@tanstack/react-query'
import { createBooking } from '@/api'

export function useBooking() {
  return useMutation({
    mutationFn: createBooking,
  })
}
