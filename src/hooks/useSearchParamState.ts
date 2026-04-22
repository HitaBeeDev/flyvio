import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '@/hooks/useDebounce'

type SerializeFn<T> = (value: T) => string
type DeserializeFn<T> = (value: string) => T

function defaultSerialize<T>(value: T) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return JSON.stringify(value)
}

function defaultDeserialize<T>(value: string, defaultValue: T): T {
  if (typeof defaultValue === 'string') {
    return value as T
  }

  if (typeof defaultValue === 'number') {
    return Number(value) as T
  }

  if (typeof defaultValue === 'boolean') {
    return (value === 'true') as T
  }

  return JSON.parse(value) as T
}

export function useSearchParamState<T>(
  key: string,
  defaultValue: T,
  serialize: SerializeFn<T> = defaultSerialize,
  deserialize: DeserializeFn<T> = (value) => defaultDeserialize(value, defaultValue),
) {
  const [searchParams, setSearchParams] = useSearchParams()

  const valueFromUrl = useMemo(() => {
    const rawValue = searchParams.get(key)

    if (rawValue == null) {
      return defaultValue
    }

    return deserialize(rawValue)
  }, [defaultValue, deserialize, key, searchParams])

  const [value, setValue] = useState<T>(valueFromUrl)
  const debouncedValue = useDebounce(value, 300)
  const serializedDefaultValue = useMemo(
    () => serialize(defaultValue),
    [defaultValue, serialize],
  )

  useEffect(() => {
    setValue(valueFromUrl)
  }, [valueFromUrl])

  useEffect(() => {
    const serializedValue = serialize(debouncedValue)

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)

      if (serializedValue === serializedDefaultValue) {
        nextParams.delete(key)
      } else {
        nextParams.set(key, serializedValue)
      }

      return nextParams
    }, { replace: true })
  }, [debouncedValue, key, serializedDefaultValue, serialize, setSearchParams])

  return [value, setValue] as const
}
