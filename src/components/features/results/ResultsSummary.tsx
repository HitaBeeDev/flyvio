import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchWidget } from "@/components/features/search/SearchWidget";
import { Button } from "@/components/ui/button";
import type { SearchParams } from "@/types";
import { formatResultsMeta, formatRouteTitle } from "./results-utils";

type ResultsSummaryProps = {
  params: Partial<SearchParams>;
};

export function ResultsSummary({ params }: ResultsSummaryProps) {
  const navigate = useNavigate();

  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
            Search Results
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
            {formatRouteTitle(params)}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {formatResultsMeta(params)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <Home className="size-4" />
            Home
          </Button>
        </div>
      </div>

      <SearchWidget variant="compact" initialParams={params} />
    </section>
  );
}
