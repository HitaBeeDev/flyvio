import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-border/80 bg-white/95 text-slate-900 shadow-lg dark:bg-slate-950/95 dark:text-stone-100",
          description: "text-slate-600 dark:text-slate-300",
          actionButton:
            "bg-slate-950 text-white dark:bg-stone-100 dark:text-slate-950",
        },
      }}
    />
  );
}
