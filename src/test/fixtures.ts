import type { OmdbMovie } from '../api/omdb'

export const searchItem = (n: number, extra: Partial<Record<string, string>> = {}) => ({
  Title: `Movie ${n}`,
  Year: String(2000 + n),
  imdbID: `tt${String(1000000 + n)}`,
  Type: 'movie',
  Poster: `https://m.media-amazon.com/images/M/poster-${n}.jpg`,
  ...extra
})

export const searchResponse = (items: ReturnType<typeof searchItem>[], total = items.length) => ({
  Response: 'True',
  Search: items,
  totalResults: String(total)
})

export const movieResponse = (overrides: Partial<OmdbMovie> = {}): OmdbMovie => ({
  Response: 'True',
  Title: 'The Matrix',
  Year: '1999',
  Rated: 'R',
  Released: '31 Mar 1999',
  Runtime: '136 min',
  Genre: 'Action, Sci-Fi',
  Director: 'Lana Wachowski, Lilly Wachowski',
  Writer: 'Lilly Wachowski, Lana Wachowski',
  Actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
  Plot: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth.',
  Language: 'English',
  Country: 'United States, Australia',
  Awards: 'Won 4 Oscars. 42 wins & 51 nominations total',
  Poster: 'https://m.media-amazon.com/images/M/matrix.jpg',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '8.7/10' },
    { Source: 'Rotten Tomatoes', Value: '83%' },
    { Source: 'Metacritic', Value: '73/100' }
  ],
  imdbRating: '8.7',
  imdbVotes: '2,100,000',
  imdbID: 'tt0133093',
  Type: 'movie',
  BoxOffice: '$172,076,928',
  ...overrides
})

export const tmdbResponse = {
  results: [
    {
      id: 1,
      title: 'Dune: Part Two',
      release_date: '2024-02-27',
      overview: 'Paul Atreides unites with the Fremen.',
      poster_path: '/dune.jpg',
      backdrop_path: '/dune-bg.jpg',
      vote_average: 8.2
    },
    { id: 2, title: 'Wicked', release_date: '2024-11-20', overview: '', poster_path: null, vote_average: 0 },
    { id: 3, title: 'Gladiator II', release_date: '2024-11-13', poster_path: '/g2.jpg', vote_average: 6.8 }
  ]
}

export const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

type Handler = (url: URL) => Response | Promise<Response>

/** Routes fetch calls by host to handlers; unknown hosts fail loudly. */
export function mockFetch(handlers: Record<string, Handler>) {
  const calls: URL[] = []
  const fn = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
    calls.push(url)
    if (init?.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    const handler = handlers[url.host]
    if (!handler) throw new Error(`Unexpected fetch to ${url.href}`)
    return handler(url)
  }
  globalThis.fetch = fn as typeof fetch
  return calls
}
