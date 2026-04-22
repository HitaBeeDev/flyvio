import { ApiError } from '@/api/errors'

export const API_UNAUTHENTICATED_EVENT = 'api:unauthenticated'

type JsonPrimitive = boolean | number | string
type JsonValue = JsonPrimitive | JsonPrimitive[] | null | undefined

function buildApiError(status: number, fallbackMessage: string, payload: unknown) {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return new ApiError(status, payload.message)
  }

  return new ApiError(status, fallbackMessage)
}

export async function requestJson<T>(
  input: string,
  init?: RequestInit,
): Promise<T | null> {
  const response = await fetch(input, init)
  const isJson = response.headers.get('content-type')?.includes('application/json') ?? false
  const payload = isJson ? await response.json() : null

  if (response.status === 401) {
    window.dispatchEvent(new Event(API_UNAUTHENTICATED_EVENT))
    throw buildApiError(401, 'Authentication required.', payload)
  }

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw buildApiError(response.status, `Request failed with status ${response.status}.`, payload)
  }

  return payload as T
}

export function createQueryString(params: Record<string, JsonValue>) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value == null) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item))
      }

      continue
    }

    searchParams.set(key, String(value))
  }

  return searchParams.toString()
}
