import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AIRPORT_INPUT_COPY } from "@/lib/constants";
import { searchAirports } from "@/data/airports";
import { AirportInputField } from "./AirportInputField";
import { AirportInputPopover } from "./AirportInputPopover";

type AirportInputProps = {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  error?: string;
};

function getDisplayValue(value?: string) {
  const airport = value
    ? searchAirports(value, 1).find((item) => item.iata === value)
    : undefined;

  if (!airport) {
    return "";
  }

  return `${airport.city} (${airport.iata})`;
}

export function AirportInput({
  value,
  onChange,
  label,
  placeholder,
  error,
}: AirportInputProps) {
  const inputId = useId();
  const listboxId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const options = useMemo(
    () => searchAirports(query || value || ""),
    [query, value],
  );
  const boundedActiveIndex = Math.min(
    activeIndex,
    Math.max(options.length - 1, 0),
  );
  const activeOption = options[boundedActiveIndex];
  const displayValue = open ? query : getDisplayValue(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && AIRPORT_INPUT_COPY.focusKeys.includes(event.key)) {
      setOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, options.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(options.length - 1, 0));
    }

    if (event.key === "Enter" && activeOption) {
      event.preventDefault();
      selectOption(activeOption.iata);
    }

    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <div ref={wrapperRef} className="relative">
        <AirportInputField
          inputId={inputId}
          listboxId={listboxId}
          errorId={errorId}
          open={open}
          activeOptionId={
            activeOption ? `${listboxId}-${activeOption.iata}` : undefined
          }
          error={error}
          displayValue={displayValue}
          placeholder={placeholder}
          inputRef={inputRef}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(nextValue) => {
            setOpen(true);
            setQuery(nextValue);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
        />

        <AirportInputPopover
          open={open}
          listboxId={listboxId}
          label={label}
          options={options}
          value={value}
          activeIndex={boundedActiveIndex}
          onHover={setActiveIndex}
          onSelect={selectOption}
        />
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-rose-600 dark:text-rose-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
