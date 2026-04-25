import { useEffect } from "react";
import { Plane } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/empty-state";
import { useFlight } from "@/hooks/useFlight";
import { FLIGHT_DETAIL_COPY } from "@/lib/constants";
import { useBookingStore } from "@/stores/bookingStore";
import { useSearchStore } from "@/stores/searchStore";
import {
  FlightDetailContent,
  FlightDetailSkeleton,
} from "./flight-detail-sections";

function getTravelerCounts() {
  const params = useSearchStore.getState().params;

  return {
    adults: params?.passengers?.adults ?? 1,
    children: params?.passengers?.children ?? 0,
  };
}

export function FlightDetailPage() {
  const navigate = useNavigate();
  const { flightId } = useParams<{ flightId: string }>();
  const resolvedFlightId = flightId ?? "";
  const { adults, children } = getTravelerCounts();
  const { data: flight, isLoading, isError } = useFlight(resolvedFlightId);
  const setFlight = useBookingStore((state) => state.setFlight);
  const setStep = useBookingStore((state) => state.setStep);

  useEffect(() => {
    if (!flight) {
      return;
    }

    document.title = `${flight.outbound[0]!.departureAirport.iata} → ${flight.outbound[flight.outbound.length - 1]!.arrivalAirport.iata} · ${flight.airline.name} — Flyvio`;
  }, [flight]);

  if (!flightId) {
    return <Navigate to="/search" replace />;
  }

  if (isLoading) {
    return (
      <AppShell>
        <FlightDetailSkeleton />
      </AppShell>
    );
  }

  if (isError || !flight) {
    return (
      <AppShell>
        <EmptyState
          title={FLIGHT_DETAIL_COPY.notFoundTitle}
          description={FLIGHT_DETAIL_COPY.notFoundDescription}
          ctaLabel={FLIGHT_DETAIL_COPY.backToSearch}
          onCtaClick={() => navigate("/search")}
          icon={<Plane className="size-12" />}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <FlightDetailContent
        flight={flight}
        adults={adults}
        children={children}
        onBook={() => {
          setFlight(flight.id);
          setStep(0);
          navigate(`/booking/${flight.id}`);
        }}
      />
    </AppShell>
  );
}
