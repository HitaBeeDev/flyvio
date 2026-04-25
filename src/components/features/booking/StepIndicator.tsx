import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKING_STEPS } from "./booking-utils";

type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start">
      {BOOKING_STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === BOOKING_STEPS.length - 1;

        return (
          <div key={step} className="flex flex-1 items-start">
            <div className="flex flex-col items-center gap-2.5">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                  isCompleted
                    ? "border-accent bg-accent text-white"
                    : isCurrent
                      ? "border-accent bg-white text-accent dark:bg-indigo-950"
                      : "border-indigo-200 bg-white text-indigo-400 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-600",
                )}
              >
                {isCompleted ? <Check className="size-3.5" /> : index + 1}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-[0.2em]",
                    isCurrent
                      ? "text-accent"
                      : "text-indigo-400 dark:text-indigo-600",
                  )}
                >
                  Step {index + 1}
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent
                      ? "text-indigo-900 dark:text-indigo-100"
                      : isCompleted
                        ? "text-indigo-500 dark:text-indigo-400"
                        : "text-indigo-400 dark:text-indigo-600",
                  )}
                >
                  {step}
                </p>
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mt-4 h-px flex-1 transition-colors duration-300",
                  isCompleted
                    ? "bg-accent"
                    : "bg-indigo-200 dark:bg-indigo-800",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
