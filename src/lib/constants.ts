export const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First'] as const

export const STOP_LABELS = {
  any: 'Any stops',
  direct: 'Nonstop only',
  '1-stop': 'Up to 1 stop',
  '2+stops': '2+ stops',
} as const

export const SORT_OPTIONS = [
  { value: 'best', label: 'Recommended' },
  { value: 'cheapest', label: 'Price: Low to High' },
  { value: 'fastest', label: 'Duration: Shortest' },
  { value: 'earliest', label: 'Departure: Earliest' },
] as const

export const PASSENGER_LIMITS = {
  minAdults: 1,
  maxAdults: 9,
  maxChildren: 8,
  maxInfants: 4,
} as const
