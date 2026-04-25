import {
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import type { SearchFormValues } from "./search-schema";
import {
  DatesField,
  RouteFields,
  TravelersField,
  TripToggle,
} from "./SearchWidgetSections";

type SearchWidgetFieldsProps = {
  control: Control<SearchFormValues>;
  errors: FieldErrors<SearchFormValues>;
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: SearchFormValues["cabinClass"];
  setValue: UseFormSetValue<SearchFormValues>;
};

export function SearchWidgetFields({
  control,
  errors,
  isRoundTrip,
  origin,
  destination,
  departureDate,
  returnDate,
  cabinClass,
  setValue,
}: SearchWidgetFieldsProps) {
  return (
    <>
      <TripToggle isRoundTrip={isRoundTrip} setValue={setValue} />
      <RouteFields
        control={control}
        errors={errors}
        origin={origin}
        destination={destination}
        setValue={setValue}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <DatesField
          errors={errors}
          isRoundTrip={isRoundTrip}
          departureDate={departureDate}
          returnDate={returnDate}
          setValue={setValue}
        />
        <TravelersField
          control={control}
          errors={errors}
          cabinClass={cabinClass}
          setValue={setValue}
        />
      </div>
    </>
  );
}
