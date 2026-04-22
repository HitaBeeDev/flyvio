import type { CabinClass, SortOption } from '@/types'

export const CABIN_CLASSES: ReadonlyArray<{ value: CabinClass; label: string }> = [
  { value: 'Economy', label: 'Economy' },
  { value: 'Premium Economy', label: 'Premium Economy' },
  { value: 'Business', label: 'Business' },
  { value: 'First', label: 'First' },
]

export const STOP_LABELS: Record<number, string> = {
  0: 'Nonstop',
  1: '1 Stop',
  2: '2+ Stops',
}

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'best', label: 'Best' },
  { value: 'cheapest', label: 'Cheapest' },
  { value: 'fastest', label: 'Fastest' },
  { value: 'earliest', label: 'Earliest' },
]

export const PASSENGER_LIMITS = {
  adults: { min: 1, max: 9 },
  children: { min: 0, max: 8 },
  infants: { min: 0, max: 4 },
  total: 9,
} as const
