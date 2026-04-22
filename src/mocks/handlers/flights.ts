import { http, HttpResponse } from 'msw'
import { flights } from '@/mocks/data/flights'

export const flightHandlers = [
  http.get('/api/flights', () => HttpResponse.json(flights)),
  http.get('/api/flights/:flightId', ({ params }) => {
    const flight = flights.find((entry) => entry.id === params.flightId)

    if (!flight) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(flight)
  }),
]
