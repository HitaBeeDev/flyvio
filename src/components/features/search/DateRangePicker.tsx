import { CalendarDays } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatWidgetDateLabel } from "./search-utils";

type DateRangePickerProps = {
  departureDate?: string;
  returnDate?: string;
  isRoundTrip: boolean;
  onChange: (value: { departureDate: string; returnDate?: string }) => void;
};

function toDate(value?: string) {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

function toIsoDate(value: Date) {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DateRangePicker({
  departureDate,
  returnDate,
  isRoundTrip,
  onChange,
}: DateRangePickerProps) {
  const today = new Date();
  const selectedRange: DateRange | undefined =
    departureDate || returnDate
      ? { from: toDate(departureDate), to: toDate(returnDate) }
      : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-between rounded-2xl px-4"
        >
          <span className="truncate">
            {formatWidgetDateLabel(departureDate, returnDate, isRoundTrip)}
          </span>
          <CalendarDays className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" avoidCollisions={false} className="w-auto rounded-[1.5rem] border border-indigo-200/80 bg-white p-0 shadow-[0_24px_80px_rgba(30,27,75,0.16)] dark:border-indigo-800/80 dark:bg-indigo-950">
        {isRoundTrip ? (
          <Calendar
            mode="range"
            numberOfMonths={2}
            showOutsideDays={false}
            selected={selectedRange}
            disabled={{ before: today }}
            onSelect={(range) => {
              if (!range?.from) {
                return;
              }

              onChange({
                departureDate: toIsoDate(range.from),
                returnDate: range.to ? toIsoDate(range.to) : undefined,
              });
            }}
          />
        ) : (
          <Calendar
            mode="single"
            numberOfMonths={1}
            selected={toDate(departureDate)}
            disabled={{ before: today }}
            onSelect={(date) => {
              if (!date) {
                return;
              }

              onChange({ departureDate: toIsoDate(date) });
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
