export type ApiErrorKind = 'missing-key' | 'network' | 'http' | 'api' | 'aborted'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | undefined

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

export const isAbortError = (error: unknown): boolean =>
  (error instanceof ApiError && error.kind === 'aborted') ||
  (error instanceof DOMException && error.name === 'AbortError')

/** Fetches JSON and turns every failure into a typed ApiError. */
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (isAbortError(error)) throw new ApiError('aborted', 'Request was cancelled')
    throw new ApiError('network', 'Network error. Check your connection and try again.')
  }
  if (!response.ok) {
    throw new ApiError('http', `The service answered with an error (${response.status}).`, response.status)
  }
  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('api', 'The service sent a response we could not read.')
  }
}

export function buildUrl(base: string, params: Record<string, string | number | undefined | null>): string {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  }
  return url.toString()
}
