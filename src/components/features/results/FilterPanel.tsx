import type { PropsWithChildren } from 'react'
import { RotateCcw } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import type { FilterState } from '@/types'
import { DEPARTURE_WINDOWS, STOP_OPTIONS, formatEuro } from './results-utils'

type AirlineOption = {
  code: string
  name: string
  count: number
}

type FilterPanelProps = {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
  priceBounds: [number, number]
  durationBounds: [number, number]
  airlines: AirlineOption[]
  className?: string
}

function FilterSection({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      {children}
    </section>
  )
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
  priceBounds,
  durationBounds,
  airlines,
  className,
}: FilterPanelProps) {
  const toggleStop = (nextStop: FilterState['stops'][number]) => {
    if (nextStop === 'any') {
      onFiltersChange({ ...filters, stops: ['any'] })
      return
    }

    const currentStops = filters.stops.filter((stop) => stop !== 'any')
    const nextStops = currentStops.includes(nextStop)
      ? currentStops.filter((stop) => stop !== nextStop)
      : [...currentStops, nextStop]

    onFiltersChange({
      ...filters,
      stops: nextStops.length > 0 ? nextStops : ['any'],
    })
  }

  return (
    <div
      className={cn(
        'space-y-6 rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            Filters
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Refine by price, timing, airline, and duration.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-accent dark:text-slate-300"
        >
          <RotateCcw className="size-4" />
          Reset filters
        </button>
      </div>

      <FilterSection title="Price Range">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {formatEuro(filters.priceRange[0])} - {formatEuro(filters.priceRange[1])}
        </div>
        <Slider
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, priceRange: value as [number, number] })
          }
        />
      </FilterSection>

      <FilterSection title="Stops">
        <div className="space-y-3">
          {STOP_OPTIONS.map((option) => (
            <label
              key={option.key}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-800"
            >
              <span>{option.label}</span>
              <Checkbox
                checked={filters.stops.includes(option.key)}
                onCheckedChange={() => toggleStop(option.key)}
              />
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Departure Time">
        <div className="grid grid-cols-2 gap-2">
          {DEPARTURE_WINDOWS.map((window) => {
            const active = filters.departureWindows.includes(window.key)

            return (
              <button
                key={window.key}
                type="button"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    departureWindows: active
                      ? filters.departureWindows.filter((item) => item !== window.key)
                      : [...filters.departureWindows, window.key],
                  })
                }
                className={cn(
                  'rounded-2xl border px-3 py-3 text-left text-sm transition',
                  active
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
                )}
              >
                {window.label}
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Airlines">
        <ScrollArea className="h-52 rounded-2xl border border-slate-200 px-3 dark:border-slate-800">
          <div className="space-y-2 py-3">
            {airlines.map((airline) => (
              <label
                key={airline.code}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filters.airlines.includes(airline.code)}
                    onCheckedChange={() =>
                      onFiltersChange({
                        ...filters,
                        airlines: filters.airlines.includes(airline.code)
                          ? filters.airlines.filter((code) => code !== airline.code)
                          : [...filters.airlines, airline.code],
                      })
                    }
                  />
                  <span>{airline.name}</span>
                </div>
                <span className="text-slate-400">{airline.count}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </FilterSection>

      <FilterSection title="Max Flight Duration">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          Up to {Math.floor(filters.maxDuration / 60)}h
        </div>
        <Slider
          min={Math.max(60, Math.floor(durationBounds[0] / 60) * 60)}
          max={Math.ceil(durationBounds[1] / 60) * 60}
          step={30}
          value={[filters.maxDuration]}
          onValueChange={(value) => onFiltersChange({ ...filters, maxDuration: value[0] ?? filters.maxDuration })}
        />
      </FilterSection>
    </div>
  )
}
