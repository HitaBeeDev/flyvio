import { Minus, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CABIN_CLASSES, PASSENGER_LIMITS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { CabinClass, PassengerCount } from '@/types'
import { formatPassengerSummary } from './search-utils'

type PassengerPickerProps = {
  value: PassengerCount
  cabinClass: CabinClass
  onValueChange: (value: PassengerCount) => void
  onCabinClassChange: (value: CabinClass) => void
}

type CounterRowProps = {
  label: string
  description: string
  value: number
  onDecrement: () => void
  onIncrement: () => void
  canDecrement: boolean
  canIncrement: boolean
}

function CounterRow({
  label,
  description,
  value,
  onDecrement,
  onIncrement,
  canDecrement,
  canIncrement,
}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-slate-900 dark:text-stone-100">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon" onClick={onDecrement} disabled={!canDecrement}>
          <Minus className="size-4" />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <Button type="button" variant="outline" size="icon" onClick={onIncrement} disabled={!canIncrement}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function PassengerPicker({
  value,
  cabinClass,
  onValueChange,
  onCabinClassChange,
}: PassengerPickerProps) {
  const totalPassengers = value.adults + value.children + value.infants

  const updateCounter = (field: keyof PassengerCount, delta: 1 | -1) => {
    const nextValue = { ...value, [field]: value[field] + delta }

    if (field === 'adults' && nextValue.adults < value.infants) {
      nextValue.infants = nextValue.adults
    }

    onValueChange(nextValue)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-12 w-full justify-between rounded-2xl px-4">
          <span className="flex items-center gap-2 truncate">
            <Users className="size-4 text-slate-400" />
            <span className="truncate">{formatPassengerSummary(value, cabinClass)}</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(92vw,28rem)] rounded-[1.5rem] p-5">
        <PopoverHeader className="mb-4">
          <PopoverTitle>Passengers & cabin</PopoverTitle>
        </PopoverHeader>

        <div className="space-y-4">
          <CounterRow
            label="Adults"
            description="Ages 12 and up"
            value={value.adults}
            onDecrement={() => updateCounter('adults', -1)}
            onIncrement={() => updateCounter('adults', 1)}
            canDecrement={value.adults > PASSENGER_LIMITS.adults.min}
            canIncrement={value.adults < PASSENGER_LIMITS.adults.max && totalPassengers < PASSENGER_LIMITS.total}
          />
          <CounterRow
            label="Children"
            description="Ages 2 to 11"
            value={value.children}
            onDecrement={() => updateCounter('children', -1)}
            onIncrement={() => updateCounter('children', 1)}
            canDecrement={value.children > PASSENGER_LIMITS.children.min}
            canIncrement={value.children < PASSENGER_LIMITS.children.max && totalPassengers < PASSENGER_LIMITS.total}
          />
          <CounterRow
            label="Infants"
            description="Under 2 years"
            value={value.infants}
            onDecrement={() => updateCounter('infants', -1)}
            onIncrement={() => updateCounter('infants', 1)}
            canDecrement={value.infants > PASSENGER_LIMITS.infants.min}
            canIncrement={value.infants < value.adults}
          />
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-slate-900 dark:text-stone-100">Cabin class</p>
          <div className="grid grid-cols-2 gap-2">
            {CABIN_CLASSES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onCabinClassChange(option.value)}
                className={cn(
                  'rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
                  cabinClass === option.value
                    ? 'border-teal-600 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-200'
                    : 'border-border/80 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <PopoverTrigger asChild>
            <Button type="button">Done</Button>
          </PopoverTrigger>
        </div>
      </PopoverContent>
    </Popover>
  )
}
