import { useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CABIN_CLASSES, PASSENGER_LIMITS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CabinClass, PassengerCount } from "@/types";
import { formatPassengerSummary } from "./search-utils";

type PassengerPickerProps = {
  value: PassengerCount;
  cabinClass: CabinClass;
  onValueChange: (value: PassengerCount) => void;
  onCabinClassChange: (value: CabinClass) => void;
};

type CounterRowProps = {
  label: string;
  description: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement: boolean;
  canIncrement: boolean;
};

function CounterRow({
  label,
  description,
  value,
  onDecrement,
  onIncrement,
  canDecrement,
  canIncrement,
}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-indigo-900 dark:text-indigo-50">
          {label}
        </p>
        <p className="text-sm text-indigo-500 dark:text-indigo-300">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onDecrement}
          disabled={!canDecrement}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onIncrement}
          disabled={!canIncrement}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function PassengerPicker({
  value,
  cabinClass,
  onValueChange,
  onCabinClassChange,
}: PassengerPickerProps) {
  const [open, setOpen] = useState(false);
  const totalPassengers = value.adults + value.children + value.infants;

  const updateCounter = (field: keyof PassengerCount, delta: 1 | -1) => {
    const nextValue = { ...value, [field]: value[field] + delta };

    if (field === "adults" && nextValue.adults < value.infants) {
      nextValue.infants = nextValue.adults;
    }

    onValueChange(nextValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-between rounded-lg px-4"
        >
          <span className="flex items-center gap-2 truncate">
            <Users className="size-4 text-indigo-400" />
            <span className="truncate">
              {formatPassengerSummary(value, cabinClass)}
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
        className="max-h-[min(70vh,34rem)] w-[min(var(--radix-popover-trigger-width),32rem)] overflow-y-auto rounded-[1.5rem] border border-indigo-200/80 bg-white p-5 text-indigo-900 shadow-[0_24px_80px_rgba(30,27,75,0.16)] dark:border-indigo-800/80 dark:bg-indigo-950 dark:text-indigo-50"
      >
        <PopoverHeader className="mb-4">
          <PopoverTitle>Passengers & cabin</PopoverTitle>
        </PopoverHeader>

        <div className="space-y-4">
          <CounterRow
            label="Adults"
            description="Ages 12 and up"
            value={value.adults}
            onDecrement={() => updateCounter("adults", -1)}
            onIncrement={() => updateCounter("adults", 1)}
            canDecrement={value.adults > PASSENGER_LIMITS.adults.min}
            canIncrement={
              value.adults < PASSENGER_LIMITS.adults.max &&
              totalPassengers < PASSENGER_LIMITS.total
            }
          />
          <CounterRow
            label="Children"
            description="Ages 2 to 11"
            value={value.children}
            onDecrement={() => updateCounter("children", -1)}
            onIncrement={() => updateCounter("children", 1)}
            canDecrement={value.children > PASSENGER_LIMITS.children.min}
            canIncrement={
              value.children < PASSENGER_LIMITS.children.max &&
              totalPassengers < PASSENGER_LIMITS.total
            }
          />
          <CounterRow
            label="Infants"
            description="Under 2 years"
            value={value.infants}
            onDecrement={() => updateCounter("infants", -1)}
            onIncrement={() => updateCounter("infants", 1)}
            canDecrement={value.infants > PASSENGER_LIMITS.infants.min}
            canIncrement={value.infants < value.adults}
          />
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-50">
            Cabin class
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CABIN_CLASSES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onCabinClassChange(option.value)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                  cabinClass === option.value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200"
                    : "border-border/80 bg-white text-indigo-700 hover:bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-900",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button type="button" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
