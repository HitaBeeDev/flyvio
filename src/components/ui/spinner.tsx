import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
};

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} satisfies Record<NonNullable<SpinnerProps["size"]>, string>;

export function Spinner({ className, size = "md", label }: SpinnerProps) {
  return (
    <>
      <LoaderCircle
        aria-hidden={label ? undefined : "true"}
        aria-label={label}
        role={label ? "status" : undefined}
        className={cn(
          "animate-spin text-current motion-reduce:animate-none",
          sizeClasses[size],
          className,
        )}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  );
}
