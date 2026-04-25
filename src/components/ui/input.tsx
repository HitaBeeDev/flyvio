import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  labelMode?: "floating" | "top";
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    type,
    label,
    labelMode = "top",
    helperText,
    error,
    leftIcon,
    rightIcon,
    placeholder,
    id,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const errorId = React.useId();
  const inputId = id ?? generatedId;
  const hasFloatingLabel = label && labelMode === "floating";

  return (
    <div className="space-y-2">
      {label && labelMode === "top" ? (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-indigo-600 dark:text-indigo-400"
        >
          {label}
        </label>
      ) : null}
      <div className="space-y-1">
        <div className="relative">
          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
              {leftIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            type={type}
            data-slot="input"
            placeholder={hasFloatingLabel ? " " : placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? errorId : undefined
            }
            className={cn(
              "peer h-11 w-full min-w-0 rounded-lg border border-indigo-200 bg-white px-4 py-3 text-sm text-indigo-900 transition-[border-color,box-shadow,background-color] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-indigo-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-50",
              "focus-visible:border-indigo-500 focus-visible:ring-[3px] focus-visible:ring-indigo-500/20",
              "aria-invalid:border-rose-500 aria-invalid:ring-rose-500/20 dark:aria-invalid:ring-rose-500/20",
              leftIcon ? "pl-11" : "",
              rightIcon ? "pr-11" : "",
              hasFloatingLabel ? "pt-5" : "",
              className,
            )}
            {...props}
          />
          {hasFloatingLabel ? (
            <label
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute left-4 top-1/2 origin-left -translate-y-1/2 text-sm text-indigo-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-indigo-700 dark:text-indigo-400 dark:peer-focus:text-indigo-400",
                leftIcon ? "left-11" : "",
                "peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-xs",
              )}
            >
              {label}
            </label>
          ) : null}
          {rightIcon ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400">
              {rightIcon}
            </span>
          ) : null}
        </div>
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-rose-600 dark:text-rose-400"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={errorId}
            className="text-sm text-indigo-500 dark:text-indigo-400"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
});

export { Input };
