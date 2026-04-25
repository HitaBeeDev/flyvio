import { ArrowRightLeft } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SEARCH_WIDGET_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AirportInput } from "./AirportInput";
import { DateRangePicker } from "./DateRangePicker";
import { PassengerPicker } from "./PassengerPicker";
import type { SearchFormValues } from "./search-schema";

type SharedProps = {
  control: Control<SearchFormValues>;
  errors: FieldErrors<SearchFormValues>;
  setValue: UseFormSetValue<SearchFormValues>;
};

export function TripToggle({
  isRoundTrip,
  setValue,
}: Pick<SharedProps, "setValue"> & { isRoundTrip: boolean }) {
  return (
    <div className="flex gap-2">
      {SEARCH_WIDGET_COPY.tripOptions.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => {
            setValue("isRoundTrip", option.value, { shouldValidate: true });

            if (!option.value) {
              setValue("returnDate", undefined, { shouldValidate: true });
            }
          }}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            isRoundTrip === option.value
              ? "bg-indigo-950 text-white dark:bg-indigo-100 dark:text-indigo-950"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

type RouteFieldsProps = SharedProps & {
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
};

export function RouteFields({
  control,
  errors,
  isRoundTrip,
  origin,
  destination,
  departureDate,
  returnDate,
  setValue,
}: RouteFieldsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_1.1fr]">
      <Controller
        control={control}
        name="origin"
        render={({ field }) => (
          <AirportInput
            label={SEARCH_WIDGET_COPY.labels.origin}
            placeholder={SEARCH_WIDGET_COPY.placeholders.origin}
            value={field.value}
            onChange={field.onChange}
            error={errors.origin?.message}
          />
        )}
      />

      <div className="flex items-end justify-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            setValue("origin", destination, { shouldValidate: true });
            setValue("destination", origin, { shouldValidate: true });
          }}
          aria-label={SEARCH_WIDGET_COPY.swapAriaLabel}
          className="rounded-full"
        >
          <ArrowRightLeft className="size-4" />
        </Button>
      </div>

      <Controller
        control={control}
        name="destination"
        render={({ field }) => (
          <AirportInput
            label={SEARCH_WIDGET_COPY.labels.destination}
            placeholder={SEARCH_WIDGET_COPY.placeholders.destination}
            value={field.value}
            onChange={field.onChange}
            icon="landing"
            error={errors.destination?.message}
          />
        )}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-200">
          {SEARCH_WIDGET_COPY.labels.dates}
        </label>
        <DateRangePicker
          departureDate={departureDate}
          returnDate={returnDate}
          isRoundTrip={isRoundTrip}
          onChange={(nextDates) => {
            setValue("departureDate", nextDates.departureDate, {
              shouldValidate: true,
            });
            setValue("returnDate", nextDates.returnDate, {
              shouldValidate: true,
            });
          }}
        />
        {errors.departureDate?.message || errors.returnDate?.message ? (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {errors.departureDate?.message ?? errors.returnDate?.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function TravelersField({
  control,
  errors,
  cabinClass,
  setValue,
}: SharedProps & { cabinClass: SearchFormValues["cabinClass"] }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-200">
        {SEARCH_WIDGET_COPY.labels.travelers}
      </label>
      <Controller
        control={control}
        name="passengers"
        render={({ field }) => (
          <PassengerPicker
            value={field.value}
            cabinClass={cabinClass}
            onValueChange={(nextValue) =>
              setValue("passengers", nextValue, {
                shouldValidate: true,
              })
            }
            onCabinClassChange={(nextValue) =>
              setValue("cabinClass", nextValue, {
                shouldValidate: true,
              })
            }
          />
        )}
      />
      {errors.passengers?.message ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {errors.passengers.message}
        </p>
      ) : null}
    </div>
  );
}
