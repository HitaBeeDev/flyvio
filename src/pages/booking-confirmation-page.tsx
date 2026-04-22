import { Navigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingStore } from '@/stores/bookingStore'

export function BookingConfirmationPage() {
  const booking = useBookingStore((state) => state.booking)
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  if (!booking || (bookingId && booking.id !== bookingId)) {
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
