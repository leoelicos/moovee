import { ApiError, buildUrl, getJson } from './http'
import type { MediaType, MovieDetails, MovieSummary, Rating, SearchPage } from './types'

const BASE = 'https://www.omdbapi.com/'
export const OMDB_PAGE_SIZE = 10

export interface SearchParams {
  query: string
  type?: MediaType | undefined
  year?: string | undefined
  page?: number | undefined
}

interface OmdbFailure {
  Response: 'False'
  Error?: string
}

interface OmdbSearchItem {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

interface OmdbSearchOk {
  Response: 'True'
  Search: OmdbSearchItem[]
  totalResults: string
}

interface OmdbRating {
  Source: string
  Value: string
}

export interface OmdbMovie {
  Response: 'True'
  Title: string
  Year: string
  Rated?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  Poster?: string
  Ratings?: OmdbRating[]
  imdbRating?: string
  imdbVotes?: string
  imdbID: string
  Type: string
  BoxOffice?: string
  totalSeasons?: string
}

/** OMDb uses the string "N/A" for missing values. */
export const clean = (value: string | undefined): string | null => {
  if (value === undefined) return null
  const trimmed = value.trim()
  return trimmed === '' || trimmed === 'N/A' ? null : trimmed
}

const list = (value: string | undefined): string[] =>
  (clean(value) ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

const toType = (value: string): MediaType => (value === 'series' || value === 'episode' ? value : 'movie')

/** Turns "7.5/10", "93%" and "72/100" into a 0–100 score. */
export function ratingScore(value: string): number | null {
  const percent = /^(\d+(?:\.\d+)?)%$/.exec(value)
  if (percent) return Math.round(Number(percent[1]))
  const fraction = /^(\d+(?:\.\d+)?)\/(\d+)$/.exec(value)
  if (fraction) return Math.round((Number(fraction[1]) / Number(fraction[2])) * 100)
  return null
}

export const toSummary = (item: OmdbSearchItem): MovieSummary => ({
  id: item.imdbID,
  title: item.Title,
  year: item.Year,
  type: toType(item.Type),
  poster: clean(item.Poster)
})

export function toDetails(movie: OmdbMovie): MovieDetails {
  const ratings: Rating[] = (movie.Ratings ?? []).map((r) => ({
    source: r.Source === 'Internet Movie Database' ? 'IMDb' : r.Source,
    value: r.Value,
    score: ratingScore(r.Value)
  }))
  const imdb = clean(movie.imdbRating)
  return {
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    type: toType(movie.Type),
    poster: clean(movie.Poster),
    rated: clean(movie.Rated),
    released: clean(movie.Released),
    runtime: clean(movie.Runtime),
    genres: list(movie.Genre),
    director: clean(movie.Director),
    writer: clean(movie.Writer),
    actors: list(movie.Actors),
    plot: clean(movie.Plot),
    language: clean(movie.Language),
    country: clean(movie.Country),
    awards: clean(movie.Awards),
    ratings,
    imdbRating: imdb === null ? null : Number(imdb),
    imdbVotes: clean(movie.imdbVotes),
    boxOffice: clean(movie.BoxOffice),
    totalSeasons: clean(movie.totalSeasons)
  }
}

/** OMDb answers "not found" style errors with HTTP 200 and Response=False. */
const EMPTY_ERRORS = ['Movie not found!', 'Series not found!', 'Episode not found!', 'Too many results.']

const searchCache = new Map<string, SearchPage>()
const detailCache = new Map<string, MovieDetails>()

export function clearOmdbCache(): void {
  searchCache.clear()
  detailCache.clear()
}

const requireKey = (key: string | null): string => {
  if (!key)
    throw new ApiError('missing-key', 'Search needs an OMDb API key. Add REACT_APP_OMDB_KEY (see .env.example).')
  return key
}

export async function searchMovies(
  params: SearchParams,
  key: string | null,
  signal?: AbortSignal
): Promise<SearchPage> {
  const apikey = requireKey(key)
  const url = buildUrl(BASE, {
    apikey,
    s: params.query,
    type: params.type,
    y: params.year,
    page: params.page ?? 1
  })
  const cached = searchCache.get(url)
  if (cached) return cached
  const data = await getJson<OmdbSearchOk | OmdbFailure>(url, signal)
  let page: SearchPage
  if (data.Response === 'True') {
    const seen = new Set<string>()
    const items = data.Search.filter((item) => {
      if (!item.imdbID || seen.has(item.imdbID)) return false
      seen.add(item.imdbID)
      return true
    }).map(toSummary)
    page = { items, total: Number(data.totalResults) || items.length }
  } else if (data.Error && EMPTY_ERRORS.includes(data.Error)) {
    page = { items: [], total: 0 }
  } else {
    throw new ApiError('api', data.Error ?? 'OMDb could not complete the search.')
  }
  searchCache.set(url, page)
  return page
}

export async function getMovie(id: string, key: string | null, signal?: AbortSignal): Promise<MovieDetails> {
  const apikey = requireKey(key)
  const cached = detailCache.get(id)
  if (cached) return cached
  const data = await getJson<OmdbMovie | OmdbFailure>(buildUrl(BASE, { apikey, i: id, plot: 'full' }), signal)
  if (data.Response !== 'True') throw new ApiError('api', data.Error ?? 'OMDb could not find that title.')
  const details = toDetails(data)
  detailCache.set(id, details)
  return details
}
