import { useCallback, useEffect, useState } from 'react'
import { clearRecent, getRecent, removeRecent } from '../lib/history'

export const RECENT_EVENT = 'moovee:recent'

export const notifyRecent = (): void => {
  window.dispatchEvent(new Event(RECENT_EVENT))
}

/** Recent searches, kept in sync across components and tabs. */
export function useRecent() {
  const [recent, setRecent] = useState<string[]>(getRecent)
  useEffect(() => {
    const sync = () => setRecent(getRecent())
    window.addEventListener(RECENT_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(RECENT_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  const remove = useCallback((query: string) => {
    removeRecent(query)
    notifyRecent()
  }, [])
  const clear = useCallback(() => {
    clearRecent()
    notifyRecent()
  }, [])
  return { recent, remove, clear }
}
