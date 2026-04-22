import { requestJson } from '@/api/client'
import type { Destination } from '@/types'

export async function getDestinations(): Promise<Destination[]> {
  return (await requestJson<Destination[]>('/api/destinations')) ?? []
}
