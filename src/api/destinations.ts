import type { Destination } from '@/types'

export async function fetchDestinations() {
  const response = await fetch('/api/destinations')

  if (!response.ok) {
    throw new Error('Failed to fetch destinations')
  }

  return (await response.json()) as Destination[]
}
