import { ApiError, buildUrl, getJson } from './http'
import type { TrendingMovie } from './types'

const API = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE = 'https://image.tmdb.org/t/p'

export type TrendingKind = 'movie' | 'series'

interface TmdbItem {
  id: number
  title?: string
  name?: string
  release_date?: string
  first_air_date?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  vote_average?: number
}

interface TmdbPage {
  results?: TmdbItem[]
}

interface TmdbFind {
  movie_results?: TmdbItem[]
  tv_results?: TmdbItem[]
}

const image = (size: string, path: string | null | undefined): string | null =>
  path ? `${TMDB_IMAGE}/${size}${path}` : null

export const toTrending = (item: TmdbItem, kind: TrendingKind = 'movie'): TrendingMovie => ({
  id: item.id,
  kind,
  title: item.title ?? item.name ?? 'Untitled',
  year: (item.release_date ?? item.first_air_date ?? '').slice(0, 4),
  overview: item.overview ?? '',
  poster: image('w342', item.poster_path),
  backdrop: image('w1280', item.backdrop_path),
  rating: typeof item.vote_average === 'number' && item.vote_average > 0 ? item.vote_average : null
})

const cache = new Map<string, TrendingMovie[]>()

export function clearTmdbCache(): void {
  cache.clear()
}

const requireKey = (key: string | null, what: string): string => {
  if (!key) throw new ApiError('missing-key', `${what} needs a TMDB API key. Add REACT_APP_TMDB_KEY.`)
  return key
}

const tmdbPath = (kind: TrendingKind) => (kind === 'series' ? 'tv' : 'movie')

/** This week's trending movies or series. */
export async function getTrending(
  key: string | null,
  signal?: AbortSignal,
  kind: TrendingKind = 'movie'
): Promise<TrendingMovie[]> {
  const api_key = requireKey(key, 'Trending')
  const cacheKey = `trending:${kind}`
  const hit = cache.get(cacheKey)
  if (hit) return hit
  const data = await getJson<TmdbPage>(buildUrl(`${API}/trending/${tmdbPath(kind)}/week`, { api_key }), signal)
  const items = (data.results ?? []).map((item) => toTrending(item, kind))
  cache.set(cacheKey, items)
  return items
}

/** "More like this": look the IMDb id up on TMDB, then ask for its recommendations. */
export async function getSimilar(
  imdbId: string,
  key: string | null,
  signal?: AbortSignal,
  limit = 12
): Promise<TrendingMovie[]> {
  const api_key = requireKey(key, 'Similar titles')
  const cacheKey = `similar:${imdbId}`
  const hit = cache.get(cacheKey)
  if (hit) return hit
  const found = await getJson<TmdbFind>(
    buildUrl(`${API}/find/${encodeURIComponent(imdbId)}`, { api_key, external_source: 'imdb_id' }),
    signal
  )
  const movie = found.movie_results?.[0]
  const tv = found.tv_results?.[0]
  const match = movie ?? tv
  const kind: TrendingKind = movie ? 'movie' : 'series'
  let items: TrendingMovie[] = []
  if (match) {
    const data = await getJson<TmdbPage>(
      buildUrl(`${API}/${tmdbPath(kind)}/${match.id}/recommendations`, { api_key }),
      signal
    )
    items = (data.results ?? []).slice(0, limit).map((item) => toTrending(item, kind))
  }
  cache.set(cacheKey, items)
  return items
}
