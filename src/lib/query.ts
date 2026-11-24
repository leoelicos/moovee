import type { MediaType, MovieSummary } from '../api/types'

export type SortKey = 'relevance' | 'newest' | 'oldest' | 'title'
export type TypeFilter = 'all' | MediaType

export interface SearchState {
  q: string
  type: TypeFilter
  year: string
  sort: SortKey
  /** imdbID of the title open in the detail view. */
  m: string | null
}

export const SORTS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' }
]

export const TYPES: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'Series' }
]

export const MIN_QUERY = 2

/** Shown when trending can't load, so the home page is never empty. */
export const QUICK_PICKS = ['Dune', 'Oppenheimer', 'Spirited Away', 'The Matrix', 'Parasite', 'Inception', 'Arrival']

/** Strips characters OMDb can't search on and collapses whitespace. */
export function cleanQuery(query: string): string {
  return query
    .replace(/[^\p{L}\p{N} ':;,./!@#$%^&*()`~?-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const isSort = (value: string | null): value is SortKey => SORTS.some((s) => s.value === value)
const isType = (value: string | null): value is TypeFilter => TYPES.some((t) => t.value === value)
const isYear = (value: string | null): value is string => value !== null && /^(18|19|20)\d{2}$/.test(value)
const isImdbId = (value: string | null): value is string => value !== null && /^tt\d{5,10}$/.test(value)

export function parseSearch(params: URLSearchParams): SearchState {
  const type = params.get('type')
  const sort = params.get('sort')
  const year = params.get('y')
  const m = params.get('m')
  return {
    q: cleanQuery(params.get('q') ?? ''),
    type: isType(type) ? type : 'all',
    year: isYear(year) ? year : '',
    sort: isSort(sort) ? sort : 'relevance',
    m: isImdbId(m) ? m : null
  }
}

/** Only non-default values go in the URL, so links stay short and shareable. */
export function toSearchParams(state: Partial<SearchState>): URLSearchParams {
  const params = new URLSearchParams()
  if (state.q) params.set('q', state.q)
  if (state.type && state.type !== 'all') params.set('type', state.type)
  if (state.year) params.set('y', state.year)
  if (state.sort && state.sort !== 'relevance') params.set('sort', state.sort)
  if (state.m) params.set('m', state.m)
  return params
}

export function searchHref(state: Partial<SearchState>): string {
  const params = toSearchParams(state).toString()
  return params ? `/search?${params}` : '/'
}

const firstYear = (year: string): number => Number(/\d{4}/.exec(year)?.[0] ?? 0)

export function sortMovies(items: MovieSummary[], sort: SortKey): MovieSummary[] {
  const copy = [...items]
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => firstYear(b.year) - firstYear(a.year))
    case 'oldest':
      return copy.sort((a, b) => firstYear(a.year) - firstYear(b.year))
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    default:
      // Keep OMDb's order, but titles with a poster first (as the old app did). sort() is stable.
      return copy.sort((a, b) => Number(b.poster !== null) - Number(a.poster !== null))
  }
}
