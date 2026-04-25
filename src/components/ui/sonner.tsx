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
            "rounded-2xl border border-border/80 bg-white/95 text-indigo-900 shadow-lg dark:bg-indigo-950/95 dark:text-indigo-50",
          description: "text-indigo-700 dark:text-indigo-200",
          actionButton:
            "bg-indigo-950 text-white dark:bg-indigo-100 dark:text-indigo-950",
        },
      }}
    />
  );
}
