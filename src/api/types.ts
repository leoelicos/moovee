export type MediaType = 'movie' | 'series' | 'episode'

export interface MovieSummary {
  id: string
  title: string
  year: string
  type: MediaType
  poster: string | null
}

export interface SearchPage {
  items: MovieSummary[]
  total: number
}

export interface Rating {
  source: 'IMDb' | 'Rotten Tomatoes' | 'Metacritic' | string
  value: string
  /** 0–100, for the meter. */
  score: number | null
}

export interface MovieDetails extends MovieSummary {
  rated: string | null
  released: string | null
  runtime: string | null
  genres: string[]
  director: string | null
  writer: string | null
  actors: string[]
  plot: string | null
  language: string | null
  country: string | null
  awards: string | null
  ratings: Rating[]
  imdbRating: number | null
  imdbVotes: string | null
  boxOffice: string | null
  totalSeasons: string | null
}

export interface TrendingMovie {
  id: number
  title: string
  year: string
  overview: string
  poster: string | null
  backdrop: string | null
  rating: number | null
}
