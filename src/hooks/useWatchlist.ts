import { useEffect, useState } from 'react'
import { getWatchlist, WATCHLIST_EVENT, type SavedTitle } from '../lib/watchlist'

/** The device watchlist, kept in sync across components and tabs. */
export function useWatchlist(): SavedTitle[] {
  const [items, setItems] = useState<SavedTitle[]>(getWatchlist)
  useEffect(() => {
    const sync = () => setItems(getWatchlist())
    window.addEventListener(WATCHLIST_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return items
}
