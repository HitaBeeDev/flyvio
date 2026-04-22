import { http, HttpResponse } from 'msw'
import { destinations } from '@/mocks/data/destinations'

export const destinationHandlers = [
  http.get('/api/destinations', () => HttpResponse.json(destinations)),
]
