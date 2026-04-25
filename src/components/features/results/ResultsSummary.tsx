import { SearchWidget } from "@/components/features/search/SearchWidget";
import type { SearchParams } from "@/types";
import { formatResultsMeta, formatRouteTitle } from "./results-utils";

type ResultsSummaryProps = {
  params: Partial<SearchParams>;
};

export function ResultsSummary({ params }: ResultsSummaryProps) {
  return (
    <section className="space-y-5 rounded-[2rem] border border-indigo-200/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(30,27,75,0.06)] backdrop-blur dark:border-indigo-800/80 dark:bg-indigo-950/80">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
          Search Results
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50 md:text-4xl">
          {formatRouteTitle(params)}
        </h1>
        <p className="text-sm text-indigo-500 dark:text-indigo-300">
          {formatResultsMeta(params)}
        </p>
      </div>

      <SearchWidget variant="compact" initialParams={params} />
    </section>
  );
}
