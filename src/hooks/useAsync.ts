import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { isAbortError } from '../api/http'

export type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

const IDLE = { status: 'idle', data: null, error: null } as const
const LOADING = { status: 'loading', data: null, error: null } as const

/**
 * Runs `task` whenever `key` changes (null = don't run). Stale requests are aborted,
 * and each result is tagged with its request, so an old answer can never show for a new key.
 */
export function useAsync<T>(
  key: string | null,
  task: (signal: AbortSignal) => Promise<T>
): AsyncState<T> & { retry: () => void } {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{ tag: string; state: AsyncState<T> } | null>(null)
  const tag = key === null ? null : `${key}#${attempt}`
  const run = useEffectEvent((signal: AbortSignal) => task(signal))

  useEffect(() => {
    if (tag === null) return
    const controller = new AbortController()
    run(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ tag, state: { status: 'success', data, error: null } })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return
        const err = error instanceof Error ? error : new Error(String(error))
        setResult({ tag, state: { status: 'error', data: null, error: err } })
      })
    return () => controller.abort()
  }, [tag])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  const state: AsyncState<T> = tag === null ? IDLE : result?.tag === tag ? result.state : LOADING
  return { ...state, retry }
}
