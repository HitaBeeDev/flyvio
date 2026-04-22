import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'
import { Button } from '@/components/ui/button'

const TOAST_DURATION_MS = 4000

export function ToastRegion() {
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        removeToast(toast.id)
      }, TOAST_DURATION_MS),
    )

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer)
      }
    }
  }, [removeToast, toasts])

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-2xl border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur dark:bg-slate-950/95"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {toast.variant === 'error' ? (
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            )}
            <p className="flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {toast.message}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
