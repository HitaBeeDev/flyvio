import { formatPrice } from "@/lib/formatters";
import { getFareBreakdown } from "./flight-detail-utils";

type FareBreakdownProps = {
  pricePerTraveler: number;
  adults: number;
  children: number;
};

export function FareBreakdown({ pricePerTraveler, adults, children }: FareBreakdownProps) {
  const breakdown = getFareBreakdown(pricePerTraveler, adults, children);

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-800 dark:bg-indigo-950">
      <div className="border-b border-indigo-100 px-5 py-4 dark:border-indigo-800">
        <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-50">Fare breakdown</p>
      </div>
      <div className="space-y-2.5 px-5 py-4 text-sm">
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
          <span>Base fare per adult</span>
          <span className="tabular-nums font-medium text-indigo-950 dark:text-indigo-50">{formatPrice(breakdown.adultBaseFare, "USD")}</span>
        </div>
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
          <span>Adults × {adults}</span>
          <span className="tabular-nums font-medium text-indigo-950 dark:text-indigo-50">{formatPrice(breakdown.adultFareTotal, "USD")}</span>
        </div>
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
          <span>Children discount</span>
          <span className="tabular-nums font-medium text-indigo-950 dark:text-indigo-50">-{formatPrice(breakdown.childrenDiscount, "USD")}</span>
        </div>
        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300">
          <span>Taxes and fees</span>
          <span className="tabular-nums font-medium text-indigo-950 dark:text-indigo-50">{formatPrice(breakdown.taxes, "USD")}</span>
        </div>
        <div className="border-t border-indigo-100 pt-2.5 dark:border-indigo-800">
          <div className="flex items-center justify-between text-base font-semibold text-indigo-950 dark:text-indigo-50">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(breakdown.total, "USD")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
