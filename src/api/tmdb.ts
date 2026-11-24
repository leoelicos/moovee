import { ApiError, buildUrl, getJson } from './http'
import type { TrendingMovie } from './types'

const BASE = 'https://api.themoviedb.org/3/movie/popular'
export const TMDB_IMAGE = 'https://image.tmdb.org/t/p'

interface TmdbMovie {
  id: number
  title: string
  release_date?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  vote_average?: number
}

interface TmdbPage {
  results: TmdbMovie[]
}

const image = (size: string, path: string | null | undefined): string | null =>
  path ? `${TMDB_IMAGE}/${size}${path}` : null

export const toTrending = (movie: TmdbMovie): TrendingMovie => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date?.slice(0, 4) ?? '',
  overview: movie.overview ?? '',
  poster: image('w342', movie.poster_path),
  backdrop: image('w1280', movie.backdrop_path),
  rating: typeof movie.vote_average === 'number' && movie.vote_average > 0 ? movie.vote_average : null
})

let cache: TrendingMovie[] | null = null

export function clearTmdbCache(): void {
  cache = null
}

export async function getTrending(key: string | null, signal?: AbortSignal): Promise<TrendingMovie[]> {
  if (!key) throw new ApiError('missing-key', 'Trending needs a TMDB API key. Add REACT_APP_TMDB_KEY.')
  if (cache) return cache
  const data = await getJson<TmdbPage>(buildUrl(BASE, { api_key: key, language: 'en-US', page: 1 }), signal)
  cache = (data.results ?? []).map(toTrending)
  return cache
}
