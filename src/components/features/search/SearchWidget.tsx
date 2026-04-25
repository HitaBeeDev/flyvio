import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEARCH_WIDGET_COPY } from "@/lib/constants";
import { useSearchStore } from "@/stores/searchStore";
import type { SearchParams } from "@/types";
import { SearchSchema } from "./search-schema";
import type { SearchFormValues } from "./search-schema";
import { formatSearchSummary } from "./search-utils";
import { SearchWidgetFields } from "./SearchWidgetFields";

type SearchWidgetProps = {
  variant?: "default" | "compact";
  initialParams?: Partial<SearchParams> | null;
};

const defaultValues: SearchFormValues = {
  origin: "",
  destination: "",
  departureDate: "",
  returnDate: undefined,
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  cabinClass: "Economy",
  isRoundTrip: true,
};

function toFormValues(params?: Partial<SearchParams> | null): SearchFormValues {
  if (!params) {
    return defaultValues;
  }

  return {
    origin: params.origin ?? "",
    destination: params.destination ?? "",
    departureDate: params.departureDate ?? "",
    returnDate: params.returnDate,
    passengers: params.passengers ?? defaultValues.passengers,
    cabinClass: params.cabinClass ?? defaultValues.cabinClass,
    isRoundTrip: params.isRoundTrip ?? defaultValues.isRoundTrip,
  };
}

export function SearchWidget({
  variant = "default",
  initialParams,
}: SearchWidgetProps) {
  const navigate = useNavigate();
  const setParams = useSearchStore((state) => state.setParams);
  const storedParams = useSearchStore((state) => state.params);
  const startingValues = useMemo(
    () => toFormValues(initialParams ?? storedParams),
    [initialParams, storedParams],
  );
  const [expanded, setExpanded] = useState(variant !== "compact");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(SearchSchema),
    defaultValues: startingValues,
    values: startingValues,
  });

  const values = useWatch({ control });
  const summary =
    values.origin && values.destination && values.departureDate
      ? formatSearchSummary(values as SearchParams)
      : SEARCH_WIDGET_COPY.compactPlaceholder;

  const onSubmit = (data: SearchFormValues) => {
    const params: SearchParams = {
      origin: data.origin,
      destination: data.destination,
      departureDate: data.departureDate,
      returnDate: data.isRoundTrip ? data.returnDate : undefined,
      passengers: data.passengers,
      cabinClass: data.cabinClass,
      isRoundTrip: data.isRoundTrip,
    };

    setParams(params);

    const query = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      adults: String(params.passengers.adults),
      children: String(params.passengers.children),
      infants: String(params.passengers.infants),
      cabinClass: params.cabinClass,
      trip: params.isRoundTrip ? "round-trip" : "one-way",
    });

    if (params.returnDate) {
      query.set("returnDate", params.returnDate);
    }

    navigate(`/search?${query.toString()}`);
    if (variant === "compact") {
      setExpanded(false);
    }
  };

  return (
    <Card className="gap-0 overflow-hidden rounded-[2rem] border-border/80 bg-white/90 p-0 dark:bg-indigo-950/85">
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
              {SEARCH_WIDGET_COPY.compactTitle}
            </p>
            <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-200">
              {summary}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-200">
            <SlidersHorizontal className="size-4" />
            {expanded ? SEARCH_WIDGET_COPY.hide : SEARCH_WIDGET_COPY.edit}
          </span>
        </button>
      ) : null}

      {expanded ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-5 py-5">
          <SearchWidgetFields
            control={control}
            errors={errors}
            isRoundTrip={values.isRoundTrip}
            origin={values.origin}
            destination={values.destination}
            departureDate={values.departureDate}
            returnDate={values.returnDate}
            cabinClass={values.cabinClass}
            setValue={setValue}
          />

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div />
            <div className="flex items-end">
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                className="h-12 w-full rounded-2xl lg:w-44"
              >
                <Search className="size-4" />
                {SEARCH_WIDGET_COPY.searchButton}
              </Button>
            </div>
          </div>
        </form>
      ) : null}
    </Card>
  );
}
