import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchWidget } from '@/components/features/search/SearchWidget'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchStore } from '@/stores/searchStore'
import type { SearchParams } from '@/types'

function getSearchParamsFromUrl(searchParams: URLSearchParams): SearchParams | null {
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const departureDate = searchParams.get('departureDate')

  if (!origin || !destination || !departureDate) {
    return null
  }

  return {
    origin,
    destination,
    departureDate,
    returnDate: searchParams.get('returnDate') ?? undefined,
    passengers: {
      adults: Number(searchParams.get('adults') ?? '1'),
      children: Number(searchParams.get('children') ?? '0'),
      infants: Number(searchParams.get('infants') ?? '0'),
    },
    cabinClass: (searchParams.get('cabinClass') as SearchParams['cabinClass']) ?? 'Economy',
    isRoundTrip: (searchParams.get('trip') ?? 'round-trip') === 'round-trip',
  }
}

export function SearchPage() {
  const [urlParams] = useSearchParams()
  const storedParams = useSearchStore((state) => state.params)
  const resolvedParams = useMemo(
    () => getSearchParamsFromUrl(urlParams) ?? storedParams,
    [storedParams, urlParams],
  )

  return (
    <AppShell>
      <div className="space-y-6">
        <SearchWidget variant="compact" initialParams={resolvedParams} />

        <Card className="border-border/80 bg-white/80 dark:bg-slate-950/75">
          <CardHeader>
            <CardDescription>Search Results</CardDescription>
            <CardTitle className="flex items-center gap-3">
              <span>Results page scaffold</span>
              <Badge variant="cabin">{resolvedParams?.cabinClass ?? 'Economy'}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>
              Route: {resolvedParams?.origin ?? '---'} → {resolvedParams?.destination ?? '---'}
            </p>
            <p>Departure: {resolvedParams?.departureDate ?? '---'}</p>
            <p>Return: {resolvedParams?.returnDate ?? 'One-way'}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
