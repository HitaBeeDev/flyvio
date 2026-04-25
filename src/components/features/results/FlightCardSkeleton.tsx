import { Skeleton } from "@/components/ui/skeleton";
import { FlightCard as BaseFlightCard } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function ItinerarySkeletonRow() {
  return (
    <div className="grid gap-2 md:grid-cols-[70px_minmax(0,1fr)] md:items-center">
      <Skeleton variant="text" className="h-3 w-14" />
      <div className="grid gap-3 md:grid-cols-[64px_minmax(96px,1fr)_64px] md:items-center">
        <div className="space-y-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton variant="text" className="w-10" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton variant="text" className="w-12" />
            <Skeleton className="h-px flex-1" />
            <Skeleton className="size-4 rounded-full" />
          </div>
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <div className="space-y-1 md:justify-self-end">
          <Skeleton className="h-5 w-14" />
          <Skeleton variant="text" className="w-10" />
        </div>
      </div>
    </div>
  );
}

export function FlightCardSkeleton() {
  return (
    <BaseFlightCard className="gap-0 rounded-lg py-0 shadow-none">
      <div className="grid gap-4 p-5 lg:grid-cols-[180px_minmax(0,1fr)_132px] lg:items-stretch">
        <div className="flex items-start gap-3">
          <Skeleton className="size-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-3">
              <Skeleton variant="text" className="w-20" />
              <Skeleton variant="text" className="w-28" />
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:px-2">
          <ItinerarySkeletonRow />
          <Separator className="bg-slate-200 dark:bg-slate-800" />
          <ItinerarySkeletonRow />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:flex-col lg:items-end lg:justify-between lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex w-full items-start justify-between gap-3 lg:flex-col lg:items-end">
            <Skeleton className="size-9 rounded-md" />
            <div className="space-y-1">
              <Skeleton className="h-8 w-20" />
              <Skeleton variant="text" className="w-16" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-md lg:w-full" />
        </div>
      </div>
    </BaseFlightCard>
  );
}
