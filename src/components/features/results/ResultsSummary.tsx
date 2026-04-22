import { SearchWidget } from '@/components/features/search/SearchWidget'
import type { SearchParams } from '@/types'
import { formatResultsMeta, formatRouteTitle } from './results-utils'

type ResultsSummaryProps = {
  params: SearchParams
}

export function ResultsSummary({ params }: ResultsSummaryProps) {
  return (
    <section className="space-y-5 rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
          Search Results
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-stone-100 md:text-4xl">
          {formatRouteTitle(params)}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatResultsMeta(params)}
        </p>
      </div>

      <SearchWidget variant="compact" initialParams={params} />
    </section>
  )
}
