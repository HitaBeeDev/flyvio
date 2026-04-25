import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { UserRound } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BOOKING_COPY } from "@/lib/constants";
import { nationalityOptions, type PassengerDescriptor } from "./booking-utils";
import type { PassengerFormValues } from "./booking-schema";

type PassengerCardProps = {
  control: Control<PassengerFormValues>;
  descriptor: PassengerDescriptor;
  index: number;
  errors: FieldErrors<PassengerFormValues>;
};

export function PassengerCard({
  control,
  descriptor,
  index,
  errors,
}: PassengerCardProps) {
  const passengerErrors = errors.passengers?.[index];

  return (
    <section className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-800 dark:bg-indigo-950">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-accent dark:bg-indigo-900">
          <UserRound className="size-4" />
        </div>
        <div>
          <p className="text-base font-semibold text-indigo-950 dark:text-indigo-50">
            {descriptor.label}
          </p>
          <p className="text-xs text-indigo-500 dark:text-indigo-400">
            {descriptor.passengerType === "adult"
              ? BOOKING_COPY.passengers.adultTraveler
              : BOOKING_COPY.passengers.childTraveler}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name={`passengers.${index}.firstName`}
          render={({ field }) => (
            <Input
              label={BOOKING_COPY.passengers.firstName}
              placeholder={BOOKING_COPY.passengers.firstNamePlaceholder}
              value={field.value}
              onChange={field.onChange}
              error={passengerErrors?.firstName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={`passengers.${index}.lastName`}
          render={({ field }) => (
            <Input
              label={BOOKING_COPY.passengers.lastName}
              placeholder={BOOKING_COPY.passengers.lastNamePlaceholder}
              value={field.value}
              onChange={field.onChange}
              error={passengerErrors?.lastName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={`passengers.${index}.dateOfBirth`}
          render={({ field }) => (
            <Input
              label={BOOKING_COPY.passengers.dateOfBirth}
              type="date"
              value={field.value}
              onChange={field.onChange}
              error={passengerErrors?.dateOfBirth?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={`passengers.${index}.passportNumber`}
          render={({ field }) => (
            <Input
              label={BOOKING_COPY.passengers.passportNumber}
              placeholder={BOOKING_COPY.passengers.passportNumberPlaceholder}
              value={field.value}
              onChange={(event) =>
                field.onChange(event.target.value.toUpperCase())
              }
              error={passengerErrors?.passportNumber?.message}
            />
          )}
        />
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor={`${descriptor.key}-nationality`}
            className="block text-xs font-medium text-indigo-600 dark:text-indigo-400"
          >
            {BOOKING_COPY.passengers.nationality}
          </label>
          <Controller
            control={control}
            name={`passengers.${index}.nationality`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={`${descriptor.key}-nationality`}
                  aria-describedby={
                    passengerErrors?.nationality
                      ? `${descriptor.key}-nationality-error`
                      : undefined
                  }
                  aria-invalid={Boolean(passengerErrors?.nationality)}
                  className="h-12 w-full rounded-lg border-indigo-200 bg-white px-4 text-left dark:border-indigo-800 dark:bg-indigo-950"
                >
                  <SelectValue
                    placeholder={BOOKING_COPY.passengers.nationalityPlaceholder}
                  />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {nationalityOptions.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {passengerErrors?.nationality ? (
            <p
              id={`${descriptor.key}-nationality-error`}
              role="alert"
              className="text-sm text-rose-600 dark:text-rose-400"
            >
              {passengerErrors.nationality.message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
