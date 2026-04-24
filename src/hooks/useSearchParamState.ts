import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type SerializeFn<T> = (value: T) => string;
type DeserializeFn<T> = (value: string) => T;

function defaultSerialize<T>(value: T) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function defaultDeserialize<T>(value: string, defaultValue: T): T {
  if (typeof defaultValue === "string") {
    return value as T;
  }

  if (typeof defaultValue === "number") {
    return Number(value) as T;
  }

  if (typeof defaultValue === "boolean") {
    return (value === "true") as T;
  }

  return JSON.parse(value) as T;
}

export function useSearchParamState<T>(
  key: string,
  defaultValue: T,
  serialize: SerializeFn<T> = defaultSerialize,
  deserialize: DeserializeFn<T> = (value) =>
    defaultDeserialize(value, defaultValue),
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const valueFromUrl = useMemo(() => {
    const rawValue = searchParams.get(key);

    if (rawValue == null) {
      return defaultValue;
    }

    return deserialize(rawValue);
  }, [defaultValue, deserialize, key, searchParams]);

  const serializedDefaultValue = useMemo(
    () => serialize(defaultValue),
    [defaultValue, serialize],
  );

  const setValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (currentValue: T) => T)(valueFromUrl)
          : nextValue;

      const serializedValue = serialize(resolvedValue);

      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);

          if (serializedValue === serializedDefaultValue) {
            nextParams.delete(key);
          } else {
            nextParams.set(key, serializedValue);
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [key, serializedDefaultValue, serialize, setSearchParams, valueFromUrl],
  );

  return [valueFromUrl, setValue] as const;
}
