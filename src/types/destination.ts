export type Region =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'Middle East'
  | 'North America'
  | 'Oceania'
  | 'South America'

export interface Destination {
  id: string
  city: string
  country: string
  region: Region
  imageUrl: string
  startingPrice: number
  iataCode: string
  tagline: string
}
