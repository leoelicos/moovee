const KEY = 'moovee:recent'
/** The CRA version stored recent searches here. */
const LEGACY_KEY = 'movies'
export const MAX_RECENT = 8

const parse = (raw: string | null): string[] => {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v.trim() !== '') : []
  } catch {
    return []
  }
}

const save = (items: string[]): string[] => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // Private mode or full storage: history just won't persist.
  }
  return items
}

export function getRecent(): string[] {
  const current = localStorage.getItem(KEY)
  if (current !== null) return parse(current)
  const legacy = parse(localStorage.getItem(LEGACY_KEY))
  return legacy.length ? save(legacy.slice(0, MAX_RECENT)) : []
}

export function addRecent(query: string): string[] {
  const q = query.trim()
  if (!q) return getRecent()
  const rest = getRecent().filter((item) => item.toLowerCase() !== q.toLowerCase())
  return save([q, ...rest].slice(0, MAX_RECENT))
}

export function removeRecent(query: string): string[] {
  return save(getRecent().filter((item) => item !== query))
}

export function clearRecent(): string[] {
  return save([])
}
