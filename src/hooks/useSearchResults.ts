import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '../api/http'
import { OMDB_PAGE_SIZE, searchMovies } from '../api/omdb'
import type { MediaType, MovieSummary } from '../api/types'
import { keys } from '../lib/env'

export interface SearchInput {
  query: string
  type: MediaType | undefined
  year: string
}

export interface SearchResults {
  status: 'idle' | 'loading' | 'success' | 'error'
  items: MovieSummary[]
  total: number
  error: Error | null
  loadingMore: boolean
  hasMore: boolean
  loadMore: () => void
  retry: () => void
}

/** OMDb stops at page 100. */
const MAX_PAGE = 100

interface Request {
  key: string
  page: number
  attempt: number
}

interface Loaded {
  key: string
  page: number
  items: MovieSummary[]
  total: number
}

const tagOf = (r: Request): string => `${r.key}#${r.page}#${r.attempt}`

/** Paged OMDb search. Changing the input resets to page 1 and cancels older requests. */
export function useSearchResults(input: SearchInput | null, apiKey: string | null = keys.omdb): SearchResults {
  const key = input ? JSON.stringify(input) : null
  const [request, setRequest] = useState<Request | null>(null)
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [failure, setFailure] = useState<{ tag: string; error: Error } | null>(null)

  // A new query always starts again at page 1 (adjusting state while rendering, not in an effect).
  if ((request?.key ?? null) !== key) {
    setRequest(key === null ? null : { key, page: 1, attempt: 0 })
  }

  useEffect(() => {
    if (!request) return
    const { key: requestKey, page } = request
    const parsed = JSON.parse(requestKey) as SearchInput
    const tag = tagOf(request)
    const controller = new AbortController()
    searchMovies({ query: parsed.query, type: parsed.type, year: parsed.year, page }, apiKey, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setLoaded((prev) => {
          if (page === 1 || prev?.key !== requestKey) {
            return { key: requestKey, page, items: result.items, total: result.total }
          }
          const seen = new Set(prev.items.map((m) => m.id))
          return {
            key: requestKey,
            page,
            items: [...prev.items, ...result.items.filter((m) => !seen.has(m.id))],
            total: result.total
          }
        })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || isAbortError(err)) return
        setFailure({ tag, error: err instanceof Error ? err : new Error(String(err)) })
      })
    return () => controller.abort()
  }, [request, apiKey])

  const loadMore = useCallback(() => setRequest((r) => (r ? { ...r, page: r.page + 1, attempt: 0 } : r)), [])
  const retry = useCallback(() => setRequest((r) => (r ? { ...r, attempt: r.attempt + 1 } : r)), [])

  const current = request && request.key === key ? request : null
  const data = current && loaded?.key === current.key ? loaded : null
  const error = current && failure?.tag === tagOf(current) ? failure.error : null
  const status: SearchResults['status'] = !current ? 'idle' : data ? 'success' : error ? 'error' : 'loading'
  const loadingMore = data !== null && current !== null && current.page > data.page && error === null
  const total = data?.total ?? 0

  return {
    status,
    items: data?.items ?? [],
    total,
    error,
    loadingMore,
    hasMore:
      data !== null && !loadingMore && error === null && data.page < MAX_PAGE && data.page * OMDB_PAGE_SIZE < total,
    loadMore,
    retry
  }
}
