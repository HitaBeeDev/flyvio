import { Skeleton } from "@/components/ui/skeleton";
import { FlightCard as BaseFlightCard } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function ItinerarySkeletonRow() {
  return (
    <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
      <Skeleton variant="text" className="h-3 w-16" />
      <div className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-18" />
          <Skeleton variant="text" className="w-10" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton variant="text" className="w-16" />
            <Skeleton className="h-px flex-1" />
            <Skeleton className="size-4 rounded-full" />
          </div>
          <Skeleton className="h-7 w-36 rounded-full" />
        </div>
        <div className="space-y-2 md:justify-self-end">
          <Skeleton className="h-7 w-18" />
          <Skeleton variant="text" className="w-10" />
        </div>
      </div>
    </div>
  );
}

export function FlightCardSkeleton() {
  return (
    <BaseFlightCard className="gap-0 py-0">
      <div className="grid gap-6 p-6 lg:grid-cols-[220px_1fr_180px]">
        <div className="flex items-start gap-4">
          <Skeleton className="size-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-32" />
          </div>
        </div>

        <div className="space-y-4 lg:pr-6">
          <ItinerarySkeletonRow />
          <Separator className="bg-slate-200/80 dark:bg-slate-800/80" />
          <ItinerarySkeletonRow />
        </div>

        <div className="flex flex-col justify-between gap-5 lg:items-end">
          <div className="space-y-2 lg:text-right">
            <Skeleton variant="text" className="ml-auto w-12" />
            <Skeleton className="ml-auto h-9 w-24" />
            <Skeleton variant="text" className="ml-auto w-20" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl lg:w-28" />
        </div>
      </div>
    </BaseFlightCard>
  );
}
