import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, Luggage, PlaneTakeoff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FlightCard as BaseFlightCard } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/uiStore'
import type { Flight, FlightSegment } from '@/types'
import { formatDuration } from '@/lib/formatters'
import { getAirlineInitials, getJourneyDuration, getStopBadge } from './results-utils'
import { cardItem } from '@/lib/motion'

function AirlineMark({ name, logoUrl }: { name: string; logoUrl: string }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {!imageFailed ? (
        <img
          src={logoUrl}
          alt={name}
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-2"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{getAirlineInitials(name)}</span>
      )}
    </div>
  )
}

function ItineraryRow({
  label,
  segments,
}: {
  label: string
  segments: FlightSegment[]
}) {
  const stopBadge = getStopBadge(segments)

  return (
    <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
        {label}
      </div>
      <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div>
          <p className="font-mono text-xl font-semibold text-slate-950 dark:text-stone-100">
            {new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }).format(new Date(segments[0]!.departureTime))}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {segments[0]!.departureAirport.iata}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{formatDuration(getJourneyDuration(segments))}</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <PlaneTakeoff className="size-4 text-accent" />
          </div>
          <Badge variant={stopBadge.variant} className="rounded-full px-3 py-1">
            {stopBadge.label}
          </Badge>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-xl font-semibold text-slate-950 dark:text-stone-100">
            {new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }).format(new Date(segments[segments.length - 1]!.arrivalTime))}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {segments[segments.length - 1]!.arrivalAirport.iata}
          </p>
        </div>
      </div>
    </div>
  )
}

type FlightCardProps = {
  flight: Flight
  onSelect?: (flight: Flight) => void
  className?: string
}

export function FlightCard({ flight, onSelect, className }: FlightCardProps) {
  const savedFlightIds = useUiStore((state) => state.savedFlightIds)
  const toggleSavedFlightId = useUiStore((state) => state.toggleSavedFlightId)
  const isSaved = savedFlightIds.includes(flight.id)

  return (
    <motion.div variants={cardItem}>
      <BaseFlightCard
        className={cn(
          'gap-0 border-slate-200/90 bg-white/95 py-0 transition duration-300 hover:scale-[1.01] hover:border-accent/60 hover:shadow-[0_24px_70px_rgba(99,102,241,0.14)] dark:border-slate-800/90 dark:bg-slate-950/90',
          className,
        )}
      >
        <button
          type="button"
          onClick={() => toggleSavedFlightId(flight.id)}
          aria-label={isSaved ? 'Remove saved flight' : 'Save flight'}
          className="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 transition hover:border-accent hover:text-accent dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300"
        >
          {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        </button>

        <div className="grid gap-6 p-6 lg:grid-cols-[220px_1fr_180px]">
          <div className="flex items-start gap-4">
            <AirlineMark name={flight.airline.name} logoUrl={flight.airline.logoUrl} />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-slate-950 dark:text-stone-100">
                {flight.airline.name}
              </p>
              <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                <p>{flight.cabinClass}</p>
                <p className="inline-flex items-center gap-2">
                  <Luggage className="size-4" />
                  {flight.baggageAllowance}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:pr-6">
            <ItineraryRow label="Outbound" segments={flight.outbound} />
            {flight.isRoundTrip && flight.inbound ? (
              <>
                <Separator className="bg-slate-200/80 dark:bg-slate-800/80" />
                <ItineraryRow label="Inbound" segments={flight.inbound} />
              </>
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-5 lg:items-end">
            <div className="space-y-1 lg:text-right">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                Price
              </p>
              <p className="text-3xl font-semibold text-slate-950 dark:text-stone-100">
                €{flight.price}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">per person</p>
            </div>
            <Button className="w-full rounded-2xl lg:w-auto" onClick={() => onSelect?.(flight)}>
              Select
            </Button>
          </div>
        </div>
      </BaseFlightCard>
    </motion.div>
  )
}
