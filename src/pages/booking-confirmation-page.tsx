import { useQuery } from '@tanstack/react-query'
import { Navigate, useSearchParams } from 'react-router-dom'
import { getBooking } from '@/api/bookings'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export function BookingConfirmationPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId!),
    enabled: bookingId !== null && bookingId.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  if (!bookingId) {
    return <Navigate to="/" replace />
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-2xl justify-center py-16">
          <Spinner size="lg" label="Loading booking details" />
        </div>
      </AppShell>
    )
  }

  if (!booking) {
    return <Navigate to="/" replace />
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Card className="border-border/80 bg-white/80 dark:bg-slate-950/75">
          <CardHeader>
            <CardDescription>Booking Confirmed</CardDescription>
            <CardTitle className="text-3xl">
              Confirmation code {booking.confirmationCode}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>Status: {booking.status}</p>
            <p>Booking ID: {booking.id}</p>
            <p>Passengers: {booking.passengers.length}</p>
            <p>Total: ${booking.totalPrice}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
