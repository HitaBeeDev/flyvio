import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-900 text-white shadow-sm hover:bg-indigo-800 dark:bg-indigo-200 dark:text-indigo-950 dark:hover:bg-indigo-100",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500/30 dark:bg-rose-500 dark:hover:bg-rose-400",
        outline:
          "border border-indigo-200 bg-white text-indigo-900 shadow-xs hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900 dark:text-indigo-50 dark:hover:bg-indigo-800",
        ghost:
          "bg-transparent text-indigo-700 hover:bg-indigo-100 hover:text-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-800 dark:hover:text-indigo-50",
      },
      size: {
        sm: "h-9 px-3.5 text-sm has-[>svg]:px-3",
        md: "h-11 px-5 text-sm has-[>svg]:px-4",
        lg: "h-12 px-6 text-base has-[>svg]:px-5",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  loading = false,
  spinnerClassName,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    spinnerClassName?: string;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const content = (
    <>
      {loading ? <Spinner className={spinnerClassName} size="sm" /> : null}
      {children}
    </>
  );

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {asChild ? children : content}
    </Comp>
  );
}

export { Button, buttonVariants };
