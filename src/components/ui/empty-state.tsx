import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  ctaLabel,
  onCtaClick,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-950/60">
      <div className="mb-5 flex size-24 items-center justify-center rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.18),_transparent_68%)] text-indigo-600 dark:text-indigo-400">
        {icon ?? (
          <svg
            viewBox="0 0 120 120"
            className="size-16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 76h84"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="m34 75 16-31 18 17 18-24 16 38"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="42" cy="36" r="7" fill="currentColor" opacity=".35" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-stone-100">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
      {ctaLabel && onCtaClick ? (
        <Button className="mt-6" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      ) : null}
    </div>
  );
}
