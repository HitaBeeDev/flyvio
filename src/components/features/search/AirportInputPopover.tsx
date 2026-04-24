import { AirportInputOptions } from "./AirportInputOptions";
import type { Airport } from "@/types";

type AirportInputPopoverProps = {
  open: boolean;
  listboxId: string;
  label: string;
  options: Airport[];
  value?: string;
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (value: string) => void;
};

export function AirportInputPopover({
  open,
  listboxId,
  label,
  options,
  value,
  activeIndex,
  onHover,
  onSelect,
}: AirportInputPopoverProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      id={listboxId}
      role="listbox"
      aria-label={label}
      className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-border/80 bg-white/95 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur dark:bg-slate-950/95"
    >
      <AirportInputOptions
        listboxId={listboxId}
        label={label}
        options={options}
        value={value}
        activeIndex={activeIndex}
        onHover={onHover}
        onSelect={onSelect}
      />
    </div>
  );
}
