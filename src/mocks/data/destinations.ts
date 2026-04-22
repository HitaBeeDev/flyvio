import type { Destination } from '@/types'

export const destinations: Destination[] = [
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    imageUrl: '/images/london.jpg',
    startingPrice: 624,
    iataCode: 'LHR',
    tagline: 'Royal landmarks, late-night theater, and nonstop transatlantic demand.',
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    imageUrl: '/images/paris.jpg',
    startingPrice: 548,
    iataCode: 'CDG',
    tagline: 'Classic boulevards, museum weekends, and quick city-hop itineraries.',
  },
]
