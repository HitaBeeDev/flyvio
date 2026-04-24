import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, MapPin, PlaneTakeoff } from 'lucide-react'
import { searchAirports } from '@/data/airports'
import { cn } from '@/lib/utils'

type AirportInputProps = {
  value?: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  error?: string
}

function getDisplayValue(value?: string) {
  const airport = value ? searchAirports(value, 1).find((item) => item.iata === value) : undefined

  if (!airport) {
    return ''
  }

  return `${airport.city} (${airport.iata})`
}

export function AirportInput({
  value,
  onChange,
  label,
  placeholder,
  error,
}: AirportInputProps) {
  const inputId = useId()
  const listboxId = useId()
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const options = useMemo(() => searchAirports(query || value || ''), [query, value])
  const boundedActiveIndex = Math.min(activeIndex, Math.max(options.length - 1, 0))
  const activeOption = options[boundedActiveIndex]
  const displayValue = open ? query : getDisplayValue(value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectOption = (nextValue: string) => {
    onChange(nextValue)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <div ref={wrapperRef} className="relative">
        <div
          className={cn(
            'flex h-12 items-center gap-3 rounded-2xl border bg-white px-4 shadow-xs transition-[border-color,box-shadow,background-color] focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15 dark:bg-slate-950',
            error ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-border/80',
          )}
        >
          <PlaneTakeoff className="size-4 text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={open && activeOption ? `${listboxId}-${activeOption.iata}` : undefined}
            aria-autocomplete="list"
            aria-describedby={error ? errorId : undefined}
            aria-invalid={Boolean(error)}
            value={displayValue}
            onFocus={() => {
              setOpen(true)
              setQuery('')
            }}
            onChange={(event) => {
              setOpen(true)
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={(event) => {
              if (!open && ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
                setOpen(true)
                return
              }

              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((current) => Math.min(current + 1, options.length - 1))
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((current) => Math.max(current - 1, 0))
              }

              if (event.key === 'Home') {
                event.preventDefault()
                setActiveIndex(0)
              }

              if (event.key === 'End') {
                event.preventDefault()
                setActiveIndex(Math.max(options.length - 1, 0))
              }

              if (event.key === 'Enter' && activeOption) {
                event.preventDefault()
                selectOption(activeOption.iata)
              }

              if (event.key === 'Escape') {
                setOpen(false)
                setQuery('')
                inputRef.current?.blur()
              }
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-stone-100"
          />
        </div>

        {open ? (
          <div
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-border/80 bg-white/95 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur dark:bg-slate-950/95"
          >
            {options.length ? (
              options.map((airport, index) => (
                <button
                  key={airport.iata}
                  id={`${listboxId}-${airport.iata}`}
                  type="button"
                  role="option"
                  aria-selected={value === airport.iata}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(airport.iata)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors',
                    index === boundedActiveIndex
                      ? 'bg-slate-100 dark:bg-slate-900'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/80',
                  )}
                >
                  <span className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 text-slate-400" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-medium text-slate-900 dark:text-stone-100">
                        {airport.iata} · {airport.city}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {airport.name}
                      </span>
                    </span>
                  </span>
                  <Check
                    className={cn(
                      'size-4 text-indigo-500',
                      value === airport.iata ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No airports match that search.
              </div>
            )}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
