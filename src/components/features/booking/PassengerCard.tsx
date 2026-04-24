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
    <section className="rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <UserRound className="size-5" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-950 dark:text-stone-100">
            {descriptor.label}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
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
                  className="h-12 w-full rounded-2xl border-slate-200 bg-white px-4 text-left dark:border-slate-800 dark:bg-slate-950"
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
