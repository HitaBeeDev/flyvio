import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchWidget } from "@/components/features/search/SearchWidget";
import type { SearchParams } from "@/types";
import { formatResultsMeta, formatRouteTitle } from "./results-utils";

type ResultsSummaryProps = {
  params: Partial<SearchParams>;
};

export function ResultsSummary({ params }: ResultsSummaryProps) {
  return (
    <section className="space-y-5">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-xs text-indigo-400 dark:text-indigo-500">
          <li>
            <Link to="/" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-300">
              Home
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="size-3 opacity-50" /></li>
          <li className="font-medium text-indigo-700 dark:text-indigo-300" aria-current="page">
            Search results
          </li>
        </ol>
      </nav>

      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
          Search Results
        </p>
        <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50 md:text-4xl">
          {formatRouteTitle(params)}
        </h1>
        <p className="text-sm text-indigo-400 dark:text-indigo-500">
          {formatResultsMeta(params)}
        </p>
      </div>

      <SearchWidget variant="compact" initialParams={params} />
    </section>
  );
}
