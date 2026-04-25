import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/utils";

type AirportInputFieldProps = {
  inputId: string;
  listboxId: string;
  errorId: string;
  open: boolean;
  activeOptionId?: string;
  error?: string;
  displayValue: string;
  placeholder: string;
  icon?: "takeoff" | "landing";
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFocus: () => void;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function AirportInputField({
  inputId,
  listboxId,
  errorId,
  open,
  activeOptionId,
  error,
  displayValue,
  placeholder,
  icon = "takeoff",
  inputRef,
  onFocus,
  onChange,
  onKeyDown,
}: AirportInputFieldProps) {
  const Icon = icon === "landing" ? PlaneLanding : PlaneTakeoff;

  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-2xl border bg-white px-4 shadow-xs transition-[border-color,box-shadow,background-color] focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15 dark:bg-indigo-950",
        error ? "border-rose-500 ring-4 ring-rose-500/10" : "border-border/80",
      )}
    >
      <Icon className="size-4 text-indigo-400" aria-hidden="true" />
      <input
        ref={inputRef}
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? activeOptionId : undefined}
        aria-autocomplete="list"
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        value={displayValue}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-indigo-900 outline-none placeholder:text-indigo-400 dark:text-indigo-50"
      />
    </div>
  );
}
