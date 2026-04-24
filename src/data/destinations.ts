import { airportsByCode } from "@/data/airports";
import type { Destination } from "@/types";

const curatedDestinations = [
  {
    iataCode: "BER",
    imageUrl:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 249,
    tagline: "Brutalist galleries, vinyl bars, and cold-lake weekends.",
  },
  {
    iataCode: "IST",
    imageUrl:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 389,
    tagline: "Ferries, spice markets, and skyline-heavy stopovers.",
  },
  {
    iataCode: "CDG",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 319,
    tagline: "Museum mornings and dense, late-night bistro blocks.",
  },
  {
    iataCode: "HND",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 689,
    tagline: "Precision transit, ramen counters, and neon after-hours.",
  },
  {
    iataCode: "JFK",
    imageUrl:
      "https://images.unsplash.com/photo-1496588152823-e5c8d4c0a0de?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 429,
    tagline: "Skyline drama and impossible restaurant density.",
  },
  {
    iataCode: "SFO",
    imageUrl:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 458,
    tagline: "Fog, hills, and design-forward coast escapes.",
  },
  {
    iataCode: "DXB",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 512,
    tagline: "Polished stays, winter sun, and ambitious dining.",
  },
  {
    iataCode: "SIN",
    imageUrl:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 544,
    tagline: "Hawker centers, gardens, and frictionless city breaks.",
  },
  {
    iataCode: "CPT",
    imageUrl:
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 607,
    tagline: "Mountain views, Atlantic light, and wine-country day trips.",
  },
  {
    iataCode: "SYD",
    imageUrl:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 734,
    tagline: "Harbor swims and polished work-trip recovery time.",
  },
  {
    iataCode: "GIG",
    imageUrl:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 566,
    tagline: "Beach mornings and high-contrast city nights.",
  },
  {
    iataCode: "BCN",
    imageUrl:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=80",
    startingPrice: 286,
    tagline: "Architecture-heavy days with slower coastal evenings.",
  },
] as const;

export const destinations: Destination[] = curatedDestinations.map(
  (destination) => {
    const airport = airportsByCode.get(destination.iataCode);

    if (!airport) {
      throw new Error(`Missing destination airport: ${destination.iataCode}`);
    }

    return {
      id: destination.iataCode.toLowerCase(),
      city: airport.city,
      country: airport.country,
      region: airport.region,
      imageUrl: destination.imageUrl,
      startingPrice: destination.startingPrice,
      iataCode: destination.iataCode,
      tagline: destination.tagline,
    };
  },
);
