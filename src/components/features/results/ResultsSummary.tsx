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
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Search Results
          </p>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl">
            {formatRouteTitle(params)}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 md:text-base">
            {formatResultsMeta(params)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            className="rounded-xl border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
