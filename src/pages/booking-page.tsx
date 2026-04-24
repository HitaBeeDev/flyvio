import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { buildPassengerDescriptors } from "@/components/features/booking/booking-utils";
import { AppShell } from "@/components/layout/AppShell";
import { Spinner } from "@/components/ui/spinner";
import { useFlight } from "@/hooks/useFlight";
import { BOOKING_COPY, SEARCH_PAGE_COPY } from "@/lib/constants";
import { useBookingStore } from "@/stores/bookingStore";
import { useSearchStore } from "@/stores/searchStore";
import { BookingPageView } from "./booking-page-view";

type StepDirection = "forward" | "backward";

export function BookingPage() {
  const { flightId: routeFlightId } = useParams<{ flightId: string }>();
  const [stepDirection, setStepDirection] = useState<StepDirection>("forward");
  const previousStepRef = useRef<number>(0);
  const flightId = useBookingStore((state) => state.flightId);
  const step = useBookingStore((state) => state.step);
  const setFlight = useBookingStore((state) => state.setFlight);
  const setStep = useBookingStore((state) => state.setStep);
  const reset = useBookingStore((state) => state.reset);
  const searchParams = useSearchStore((state) => state.params);
  const resolvedFlightId = routeFlightId ?? flightId ?? "";
  const travelerAdults = searchParams?.passengers?.adults ?? 1;
  const travelerChildren = searchParams?.passengers?.children ?? 0;
  const travelerCount = travelerAdults + travelerChildren;
  const descriptors = buildPassengerDescriptors(
    travelerAdults,
    travelerChildren,
  );
  const { data: flight, isLoading } = useFlight(resolvedFlightId);

  useEffect(() => {
    if (!routeFlightId) {
      return;
    }

    reset();
    setFlight(routeFlightId);
    setStep(0);
  }, [reset, routeFlightId, setFlight, setStep]);

  useEffect(() => {
    document.title = BOOKING_COPY.pageTitleDocument;
  }, []);

  useEffect(() => {
    if (step === 0) {
      return;
    }

    window.history.pushState({ bookingStep: step }, "");

    const handlePopState = () => {
      const currentStep = useBookingStore.getState().step;

      if (currentStep > 0) {
        const nextStep = (currentStep - 1) as 0 | 1 | 2;
        useBookingStore.getState().setStep(nextStep);
        window.history.pushState({ bookingStep: nextStep }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]);

  useEffect(() => {
    setStepDirection(step >= previousStepRef.current ? "forward" : "backward");
    previousStepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (step === 0) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step]);

  if (!resolvedFlightId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label={SEARCH_PAGE_COPY.loadingLabel} />
        </div>
      </AppShell>
    );
  }

  if (!flight) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppShell>
      <BookingPageView
        step={step}
        stepDirection={stepDirection}
        travelerCount={travelerCount}
        descriptors={descriptors}
        flight={flight}
      />
    </AppShell>
  );
}
