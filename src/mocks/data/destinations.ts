import type { Destination } from '@/types'

export const destinations: Destination[] = [
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    airportCode: 'LHR',
    priceFrom: 624,
    imageUrl: '/images/london.jpg',
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    airportCode: 'CDG',
    priceFrom: 548,
    imageUrl: '/images/paris.jpg',
  },
]
