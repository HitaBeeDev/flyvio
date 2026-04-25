import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKING_STEPS } from "./booking-utils";

type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {BOOKING_STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={step}
            className={cn(
              "relative overflow-hidden rounded-[1.75rem] border px-4 py-4 transition",
              isCompleted
                ? "border-accent bg-accent text-white"
                : isCurrent
                  ? "border-accent bg-white text-indigo-950 shadow-[0_14px_32px_rgba(99,102,241,0.16)] dark:bg-indigo-950 dark:text-indigo-50"
                  : "border-indigo-200 bg-indigo-100 text-indigo-500 dark:border-indigo-800 dark:bg-indigo-900 dark:text-indigo-400",
            )}
          >
            {isCurrent ? (
              <motion.div
                layoutId="booking-step-highlight"
                className="absolute inset-0 rounded-[1.75rem] border-2 border-accent"
                transition={{ duration: 0.25 }}
              />
            ) : null}
            <div className="relative flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border text-sm font-semibold",
                  isCompleted
                    ? "border-white/30 bg-white/15 text-white"
                    : isCurrent
                      ? "border-accent text-accent"
                      : "border-indigo-200 text-indigo-400 dark:border-indigo-700 dark:text-indigo-400",
                )}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] opacity-70">
                  Step {index + 1}
                </p>
                <p className="text-base font-semibold">{step}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
