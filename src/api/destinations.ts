import { destinations } from '@/data/destinations'
import type { Destination } from '@/types'

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function getDestinations(): Promise<Destination[]> {
  await delay(220)
  return destinations
}
