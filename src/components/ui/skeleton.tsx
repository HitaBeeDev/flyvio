import { FlightCard, FlightCardDivider } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  variant = "block",
  ...props
}: React.ComponentProps<"div"> & { variant?: "block" | "text" }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-indigo-200/80 dark:bg-indigo-800/80",
        variant === "text" ? "h-4 rounded-full" : "",
        className,
      )}
      {...props}
    />
  );
}

function FlightCardSkeleton() {
  return (
    <FlightCard className="gap-0 py-0">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <Skeleton variant="text" className="w-20" />
          <Skeleton className="h-8 w-28" />
          <Skeleton variant="text" className="w-32" />
        </div>
        <div className="flex min-w-28 flex-col items-center justify-center gap-3">
          <Skeleton variant="text" className="w-16" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton variant="text" className="w-20" />
        </div>
        <div className="space-y-3 text-right">
          <Skeleton variant="text" className="ml-auto w-20" />
          <Skeleton className="ml-auto h-8 w-28" />
          <Skeleton variant="text" className="ml-auto w-32" />
        </div>
      </div>
      <FlightCardDivider />
      <div className="flex items-center justify-between gap-4 p-6">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </FlightCard>
  );
}

export { Skeleton, FlightCardSkeleton };
