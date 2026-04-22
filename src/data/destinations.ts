import { airportsByCode } from '@/data/airports'
import type { Destination } from '@/types/travel'

function getAirport(code: string) {
  const airport = airportsByCode.get(code)

  if (!airport) {
    throw new Error(`Missing destination airport: ${code}`)
  }

  return airport
}

const destinationConfigs = [
  {
    airportCode: 'BER',
    headline: 'Berlin for brutalist galleries and late-night listening bars',
    description:
      'A sharp mix of club culture, modern design, and walkable neighborhoods that rewards spontaneous weekends.',
    imageUrl:
      'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'IST',
    headline: 'Istanbul where ferry rides split the day between continents',
    description:
      'Markets, waterfront tea, and layered history make it one of the easiest cities to fill with memorable small moments.',
    imageUrl:
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'CDG',
    headline: 'Paris for long museum mornings and compact hotel bars',
    description:
      'Dense with landmarks but still best enjoyed through side streets, late dinners, and one more pastry stop.',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'HND',
    headline: 'Tokyo for precision shopping and all-night ramen counters',
    description:
      'High-speed transit and neighborhood-scale detail make it ideal for travelers who want structure without routine.',
    imageUrl:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'JFK',
    headline: 'New York for skyline drama and impossible restaurant density',
    description:
      'Best approached with a short list and extra room for detours, whether that means jazz, galleries, or a midnight slice.',
    imageUrl:
      'https://images.unsplash.com/photo-1496588152823-e5c8d4c0a0de?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'SFO',
    headline: 'San Francisco for hills, fog, and compact weekend escapes',
    description:
      'A good fit for design-forward travelers who want strong coffee, strong views, and quick access to the coast.',
    imageUrl:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'DXB',
    headline: 'Dubai for polished stays and high-contrast desert day trips',
    description:
      'An efficient stop for luxury travelers who want modern hotels, winter sun, and ambitious dining in one place.',
    imageUrl:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'SIN',
    headline: 'Singapore for hawker centers and seamless urban downtime',
    description:
      'Comfortable, green, and hyper-functional, with enough food and architecture to fill even a short layover.',
    imageUrl:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'CPT',
    headline: 'Cape Town for mountain views and ocean-heavy itineraries',
    description:
      'One of the strongest combinations of city energy, scenery, and nearby wine-country drives.',
    imageUrl:
      'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'SYD',
    headline: 'Sydney for harbor swims and bright winter work trips',
    description:
      'Useful when the brief is equal parts polished business travel and genuinely good outdoor recovery time.',
    imageUrl:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'GIG',
    headline: 'Rio de Janeiro for beach mornings and high-contrast city nights',
    description:
      'A visually loud, high-energy destination that suits shorter trips with a flexible schedule.',
    imageUrl:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
  },
  {
    airportCode: 'BCN',
    headline: 'Barcelona for architecture-heavy days and slower coastal evenings',
    description:
      'Easy to sell for mixed groups because the food, transit, and seaside pacing all work in its favor.',
    imageUrl:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
  },
] as const

export const destinations: Destination[] = destinationConfigs.map((destination) => {
  const airport = getAirport(destination.airportCode)

  return {
    id: destination.airportCode.toLowerCase(),
    airportCode: airport.code,
    city: airport.city,
    country: airport.country,
    headline: destination.headline,
    description: destination.description,
    imageUrl: destination.imageUrl,
  }
})
