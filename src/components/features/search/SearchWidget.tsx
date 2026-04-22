import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { ArrowRightLeft, Search, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSearchStore } from '@/stores/searchStore'
import type { SearchParams } from '@/types'
import { AirportInput } from './AirportInput'
import { DateRangePicker } from './DateRangePicker'
import { PassengerPicker } from './PassengerPicker'
import { SearchSchema } from './search-schema'
import type { SearchFormValues } from './search-schema'
import { formatSearchSummary } from './search-utils'

type SearchWidgetProps = {
  variant?: 'default' | 'compact'
  initialParams?: Partial<SearchParams> | null
}

const defaultValues: SearchFormValues = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: undefined,
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  cabinClass: 'Economy',
  isRoundTrip: true,
}

function toFormValues(params?: Partial<SearchParams> | null): SearchFormValues {
  if (!params) {
    return defaultValues
  }

  return {
    origin: params.origin ?? '',
    destination: params.destination ?? '',
    departureDate: params.departureDate ?? '',
    returnDate: params.returnDate,
    passengers: params.passengers ?? defaultValues.passengers,
    cabinClass: params.cabinClass ?? defaultValues.cabinClass,
    isRoundTrip: params.isRoundTrip ?? defaultValues.isRoundTrip,
  }
}

export function SearchWidget({
  variant = 'default',
  initialParams,
}: SearchWidgetProps) {
  const navigate = useNavigate()
  const setParams = useSearchStore((state) => state.setParams)
  const storedParams = useSearchStore((state) => state.params)
  const startingValues = useMemo(
    () => toFormValues(initialParams ?? storedParams),
    [initialParams, storedParams],
  )
  const [expanded, setExpanded] = useState(variant !== 'compact')

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(SearchSchema),
    defaultValues: startingValues,
    values: startingValues,
  })

  const values = watch()
  const summary =
    values.origin && values.destination && values.departureDate
      ? formatSearchSummary(values as SearchParams)
      : 'Choose route, dates, and passengers'

  const onSubmit = (data: SearchFormValues) => {
    const params: SearchParams = {
      origin: data.origin,
      destination: data.destination,
      departureDate: data.departureDate,
      returnDate: data.isRoundTrip ? data.returnDate : undefined,
      passengers: data.passengers,
      cabinClass: data.cabinClass,
      isRoundTrip: data.isRoundTrip,
    }

    setParams(params)

    const query = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      adults: String(params.passengers.adults),
      children: String(params.passengers.children),
      infants: String(params.passengers.infants),
      cabinClass: params.cabinClass,
      trip: params.isRoundTrip ? 'round-trip' : 'one-way',
    })

    if (params.returnDate) {
      query.set('returnDate', params.returnDate)
    }

    navigate(`/search?${query.toString()}`)
    if (variant === 'compact') {
      setExpanded(false)
    }
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-[2rem] border-border/80 bg-white/85 p-0 dark:bg-slate-950/75">
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
              Search Summary
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{summary}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <SlidersHorizontal className="size-4" />
            {expanded ? 'Hide' : 'Edit'}
          </span>
        </button>
      ) : null}

      {expanded ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-5 py-5">
          <div className="flex gap-2">
            {[
              { label: 'Round-trip', value: true },
              { label: 'One-way', value: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setValue('isRoundTrip', option.value, { shouldValidate: true })
                  if (!option.value) {
                    setValue('returnDate', undefined, { shouldValidate: true })
                  }
                }}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  values.isRoundTrip === option.value
                    ? 'bg-slate-950 text-white dark:bg-stone-100 dark:text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_1.1fr]">
            <Controller
              control={control}
              name="origin"
              render={({ field }) => (
                <AirportInput
                  label="Origin"
                  placeholder="Where from?"
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
                  const currentOrigin = values.origin
                  const currentDestination = values.destination
                  setValue('origin', currentDestination, { shouldValidate: true })
                  setValue('destination', currentOrigin, { shouldValidate: true })
                }}
                aria-label="Swap origin and destination"
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
                  label="Destination"
                  placeholder="Where to?"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.destination?.message}
                />
              )}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Dates
              </label>
              <DateRangePicker
                departureDate={values.departureDate}
                returnDate={values.returnDate}
                isRoundTrip={values.isRoundTrip}
                onChange={({ departureDate, returnDate }) => {
                  setValue('departureDate', departureDate, { shouldValidate: true })
                  setValue('returnDate', returnDate, { shouldValidate: true })
                }}
              />
              {errors.departureDate?.message || errors.returnDate?.message ? (
                <p className="text-sm text-rose-600 dark:text-rose-400">
                  {errors.departureDate?.message ?? errors.returnDate?.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Travelers
              </label>
              <Controller
                control={control}
                name="passengers"
                render={({ field }) => (
                  <PassengerPicker
                    value={field.value}
                    cabinClass={values.cabinClass}
                    onValueChange={(nextValue) =>
                      setValue('passengers', nextValue, { shouldValidate: true })
                    }
                    onCabinClassChange={(nextValue) =>
                      setValue('cabinClass', nextValue, { shouldValidate: true })
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

            <div className="flex items-end">
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                className="h-12 w-full rounded-2xl lg:w-44"
              >
                <Search className="size-4" />
                Search
              </Button>
            </div>
          </div>
        </form>
      ) : null}
    </Card>
  )
}
