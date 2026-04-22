export const CABIN_CLASSES = ['economy', 'premium-economy', 'business', 'first'] as const

export const STOP_LABELS = {
  any: 'Any stops',
  nonstop: 'Nonstop only',
  oneStop: 'Up to 1 stop',
  twoPlusStops: '2+ stops',
} as const

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'duration-asc', label: 'Duration: Shortest' },
  { value: 'departure-asc', label: 'Departure: Earliest' },
] as const

export const PASSENGER_LIMITS = {
  minAdults: 1,
  maxAdults: 9,
  maxChildren: 8,
  maxInfants: 4,
} as const
