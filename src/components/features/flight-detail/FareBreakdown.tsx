import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatters";
import { getFareBreakdown } from "./flight-detail-utils";

type FareBreakdownProps = {
  pricePerTraveler: number;
  adults: number;
  children: number;
};

export function FareBreakdown({
  pricePerTraveler,
  adults,
  children,
}: FareBreakdownProps) {
  const breakdown = getFareBreakdown(pricePerTraveler, adults, children);

  return (
    <Card className="gap-0 rounded-2xl border-slate-200 bg-white py-0 shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="border-b border-slate-100 py-5 dark:border-slate-800">
        <CardTitle className="text-2xl text-slate-950 dark:text-slate-50">
          Fare breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Base fare per adult</span>
            <span className="font-medium text-slate-950 dark:text-slate-50">{formatPrice(breakdown.adultBaseFare, "USD")}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Adults × {adults}</span>
            <span className="font-medium text-slate-950 dark:text-slate-50">{formatPrice(breakdown.adultFareTotal, "USD")}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Children discount</span>
            <span className="font-medium text-slate-950 dark:text-slate-50">-{formatPrice(breakdown.childrenDiscount, "USD")}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 text-slate-600 dark:text-slate-300">
            <span>Taxes and fees</span>
            <span className="font-medium text-slate-950 dark:text-slate-50">{formatPrice(breakdown.taxes, "USD")}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-[1fr_auto] gap-3 text-base font-semibold text-slate-950 dark:text-slate-50">
              <span>Total</span>
              <span>{formatPrice(breakdown.total, "USD")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
