import { CalendarDays } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatWidgetDateLabel } from './search-utils'

type DateRangePickerProps = {
  departureDate?: string
  returnDate?: string
  isRoundTrip: boolean
  onChange: (value: { departureDate: string; returnDate?: string }) => void
}

function toDate(value?: string) {
  return value ? new Date(`${value}T00:00:00`) : undefined
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10)
}

export function DateRangePicker({
  departureDate,
  returnDate,
  isRoundTrip,
  onChange,
}: DateRangePickerProps) {
  const today = new Date()
  const selectedRange: DateRange | undefined =
    departureDate || returnDate
      ? { from: toDate(departureDate), to: toDate(returnDate) }
      : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-12 w-full justify-between rounded-2xl px-4">
          <span className="truncate">
            {formatWidgetDateLabel(departureDate, returnDate, isRoundTrip)}
          </span>
          <CalendarDays className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-[1.5rem] p-0">
        {isRoundTrip ? (
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={selectedRange}
            disabled={{ before: today }}
            onSelect={(range) => {
              if (!range?.from) {
                return
              }

              onChange({
                departureDate: toIsoDate(range.from),
                returnDate: range.to ? toIsoDate(range.to) : undefined,
              })
            }}
          />
        ) : (
          <Calendar
            mode="single"
            numberOfMonths={1}
            selected={toDate(departureDate)}
            disabled={{ before: today }}
            onSelect={(date) => {
              if (!date) {
                return
              }

              onChange({ departureDate: toIsoDate(date) })
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
