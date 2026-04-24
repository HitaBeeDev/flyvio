import { useEffect } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/empty-state";
import { useBooking } from "@/hooks/useBooking";
import { BOOKING_CONFIRMATION_COPY } from "@/lib/constants";
import {
  BookingConfirmationContent,
  ConfirmationSkeleton,
} from "./booking-confirmation-sections";

export function BookingConfirmationPage() {
  const { bookingId: routeBookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const bookingId = routeBookingId ?? searchParams.get("bookingId");
  const { data: booking, isLoading, isError } = useBooking(bookingId ?? "");

  useEffect(() => {
    document.title = BOOKING_CONFIRMATION_COPY.documentTitle;
  }, []);

  if (!bookingId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <AppShell>
        <ConfirmationSkeleton />
      </AppShell>
    );
  }

  if (isError || !booking) {
    return (
      <AppShell>
        <EmptyState
          title={BOOKING_CONFIRMATION_COPY.missingTitle}
          description={BOOKING_CONFIRMATION_COPY.missingDescription}
          ctaLabel={BOOKING_CONFIRMATION_COPY.missingCta}
          onCtaClick={() => {
            window.location.href = "/";
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <BookingConfirmationContent booking={booking} />
    </AppShell>
  );
}
