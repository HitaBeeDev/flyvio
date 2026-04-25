import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BOOKING_COPY } from "@/lib/constants";
import { BookingReview } from "@/components/features/booking/BookingReview";
import { ExtrasForm } from "@/components/features/booking/ExtrasForm";
import { PassengerForm } from "@/components/features/booking/PassengerForm";
import { PriceSummary } from "@/components/features/booking/PriceSummary";
import { StepIndicator } from "@/components/features/booking/StepIndicator";
import type { Flight } from "@/types";
import type { PassengerDescriptor } from "@/components/features/booking/booking-utils";

type StepDirection = "forward" | "backward";

type BookingPageViewProps = {
  step: 0 | 1 | 2;
  stepDirection: StepDirection;
  travelerCount: number;
  descriptors: PassengerDescriptor[];
  flight: Flight;
};

export function BookingPageView({
  step,
  stepDirection,
  travelerCount,
  descriptors,
  flight,
}: BookingPageViewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      <section>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
          {BOOKING_COPY.pageEyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
          {BOOKING_COPY.pageTitle}
        </h1>
        <p className="mt-1 text-sm text-indigo-400 dark:text-indigo-400">
          {flight.outbound[0]!.departureAirport.iata} to{" "}
          {flight.outbound[flight.outbound.length - 1]!.arrivalAirport.iata}{" "}
          <span className="mx-1 opacity-40">·</span>
          {travelerCount} {travelerCount === 1 ? "traveler" : "travelers"}
        </p>
      </section>

      <StepIndicator currentStep={step} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={stepDirection}>
            <motion.div
              key={step}
              custom={stepDirection}
              variants={{
                hidden: (dir: StepDirection) => ({
                  x: shouldReduceMotion ? 0 : dir === "forward" ? 40 : -40,
                  opacity: 0,
                }),
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.24,
                    ease: "easeOut",
                  },
                },
                exit: (dir: StepDirection) => ({
                  x: shouldReduceMotion ? 0 : dir === "forward" ? -40 : 40,
                  opacity: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.18,
                    ease: "easeIn",
                  },
                }),
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {step === 0 ? <PassengerForm descriptors={descriptors} /> : null}
              {step === 1 ? (
                <ExtrasForm flight={flight} passengers={descriptors} />
              ) : null}
              {step === 2 ? (
                <BookingReview flight={flight} descriptors={descriptors} />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </section>

        <aside>
          <PriceSummary flight={flight} travelerCount={travelerCount} />
        </aside>
      </div>
    </div>
  );
}
