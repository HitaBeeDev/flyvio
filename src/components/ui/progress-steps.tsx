import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProgressStepsProps = {
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <ol className={cn('grid gap-4 sm:grid-cols-3', className)}>
      {steps.map((step, index) => {
        const isComplete = index < currentStep
        const isCurrent = index === currentStep

        return (
          <li
            key={step}
            className={cn(
              'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm',
              isCurrent
                ? 'border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-200'
                : 'border-border/80 bg-white/70 text-slate-600 dark:bg-slate-950/60 dark:text-slate-300',
            )}
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                isComplete || isCurrent
                  ? 'border-transparent bg-slate-950 text-white dark:bg-stone-100 dark:text-slate-950'
                  : 'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400',
              )}
            >
              {isComplete ? <Check className="size-4" /> : index + 1}
            </span>
            <span className="font-medium">{step}</span>
          </li>
        )
      })}
    </ol>
  )
}
