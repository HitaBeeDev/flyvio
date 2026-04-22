import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type DatePickerProps = {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

type DateRangePickerProps = {
  value?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Select date',
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-between rounded-2xl', className)}>
          <span>{date ? format(date, 'MMM d, yyyy') : placeholder}</span>
          <CalendarDays className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onDateChange} />
      </PopoverContent>
    </Popover>
  )
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = 'Select dates',
  className,
}: DateRangePickerProps) {
  const label =
    value?.from && value?.to
      ? `${format(value.from, 'MMM d')} - ${format(value.to, 'MMM d, yyyy')}`
      : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-between rounded-2xl', className)}>
          <span>{label}</span>
          <CalendarDays className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="range" numberOfMonths={2} selected={value} onSelect={onValueChange} />
      </PopoverContent>
    </Popover>
  )
}
