import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/formatters'
import { getFareBreakdown } from './flight-detail-utils'

type FareBreakdownProps = {
  pricePerTraveler: number
  adults: number
  children: number
}

export function FareBreakdown({
  pricePerTraveler,
  adults,
  children,
}: FareBreakdownProps) {
  const breakdown = getFareBreakdown(pricePerTraveler, adults, children)

  return (
    <Card className="gap-0 border-slate-200/80 bg-white/90 py-0 dark:border-slate-800/80 dark:bg-slate-950/80 lg:sticky lg:top-28">
      <CardHeader className="border-b border-slate-200/80 py-5 dark:border-slate-800/80">
        <CardTitle className="text-2xl text-slate-950 dark:text-stone-100">
          Fare breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Base fare per adult</span>
            <span>{formatPrice(breakdown.adultBaseFare, 'USD')}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Adults × {adults}</span>
            <span>{formatPrice(breakdown.adultFareTotal, 'USD')}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Children discount</span>
            <span>-{formatPrice(breakdown.childrenDiscount, 'USD')}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Taxes and fees</span>
            <span>{formatPrice(breakdown.taxes, 'USD')}</span>
          </div>
          <div className="rounded-[1.4rem] border border-accent/20 bg-accent/10 px-4 py-4">
            <div className="grid grid-cols-[1fr_auto] gap-3 text-base font-semibold text-slate-950 dark:text-stone-100">
              <span>Total</span>
              <span>{formatPrice(breakdown.total, 'USD')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
