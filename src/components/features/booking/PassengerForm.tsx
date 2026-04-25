import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BOOKING_COPY } from "@/lib/constants";
import { useBookingStore } from "@/stores/bookingStore";
import {
  type PassengerDescriptor,
  validatePassengerAge,
  createEmptyPassengers,
} from "./booking-utils";
import {
  passengerFormSchema,
  type PassengerFormValues,
} from "./booking-schema";
import { PassengerCard } from "./PassengerCard";

type PassengerFormProps = {
  descriptors: PassengerDescriptor[];
};

export function PassengerForm({ descriptors }: PassengerFormProps) {
  const passengers = useBookingStore((state) => state.passengers);
  const setPassengers = useBookingStore((state) => state.setPassengers);
  const setStep = useBookingStore((state) => state.setStep);
  const defaultPassengers = useMemo(
    () =>
      passengers.length === descriptors.length
        ? passengers
        : createEmptyPassengers(descriptors),
    [descriptors, passengers],
  );
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: { passengers: defaultPassengers },
    values: { passengers: defaultPassengers },
  });

  const onSubmit = (values: PassengerFormValues) => {
    let hasAgeErrors = false;

    descriptors.forEach((descriptor, index) => {
      const ageError = validatePassengerAge(
        values.passengers[index]!,
        descriptor.passengerType,
      );

      if (ageError) {
        hasAgeErrors = true;
        setError(`passengers.${index}.dateOfBirth`, {
          type: "manual",
          message: ageError,
        });
      }
    });

    if (hasAgeErrors) {
      return;
    }

    setPassengers(values.passengers);
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {descriptors.map((descriptor, index) => (
        <PassengerCard
          key={descriptor.key}
          control={control}
          descriptor={descriptor}
          index={index}
          errors={errors}
        />
      ))}

      <div className="flex justify-end">
        <Button type="submit" className="rounded-lg">
          {BOOKING_COPY.passengers.continueLabel}
        </Button>
      </div>
    </form>
  );
}
