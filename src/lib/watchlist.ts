import type { MovieSummary } from '../api/types'

const KEY = 'moovee:watchlist'
export const WATCHLIST_EVENT = 'moovee:watchlist'

export interface SavedTitle extends MovieSummary {
  addedAt: number
}

const isSaved = (value: unknown): value is SavedTitle => {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.id === 'string' && typeof v.title === 'string' && typeof v.year === 'string'
}

export function getWatchlist(): SavedTitle[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isSaved) : []
  } catch {
    return []
  }
}

const save = (items: SavedTitle[]): SavedTitle[] => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // Storage blocked: the list still works for this page view.
  }
  window.dispatchEvent(new Event(WATCHLIST_EVENT))
  return items
}

export const inWatchlist = (id: string): boolean => getWatchlist().some((item) => item.id === id)

/** Adds or removes a title. Newest saves first. Returns whether it is now saved. */
export function toggleWatchlist(movie: MovieSummary, now = Date.now()): boolean {
  const list = getWatchlist()
  if (list.some((item) => item.id === movie.id)) {
    save(list.filter((item) => item.id !== movie.id))
    return false
  }
  const { id, title, year, type, poster } = movie
  save([{ id, title, year, type, poster, addedAt: now }, ...list])
  return true
}

export function removeFromWatchlist(id: string): void {
  save(getWatchlist().filter((item) => item.id !== id))
}
