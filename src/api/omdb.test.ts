import { jsonResponse, mockFetch, movieResponse, searchItem, searchResponse } from '../test/fixtures'
import { clean, getMovie, ratingScore, searchMovies, toDetails } from './omdb'

describe('helpers', () => {
  it('clean drops N/A and blanks', () => {
    expect(clean('N/A')).toBeNull()
    expect(clean(' ')).toBeNull()
    expect(clean(undefined)).toBeNull()
    expect(clean(' PG ')).toBe('PG')
  })

  it.each([
    ['8.7/10', 87],
    ['83%', 83],
    ['73/100', 73],
    ['great', null]
  ])('ratingScore(%s) = %s', (value, score) => {
    expect(ratingScore(value)).toBe(score)
  })

  it('toDetails normalises an OMDb title', () => {
    const details = toDetails(movieResponse())
    expect(details).toMatchObject({
      id: 'tt0133093',
      genres: ['Action', 'Sci-Fi'],
      actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
      imdbRating: 8.7,
      type: 'movie',
      totalSeasons: null
    })
    expect(details.ratings[0]).toEqual({ source: 'IMDb', value: '8.7/10', score: 87 })
  })

  it('toDetails copes with missing fields', () => {
    const details = toDetails({ Response: 'True', Title: 'X', Year: '2020', imdbID: 'tt1', Type: 'series' })
    expect(details).toMatchObject({ genres: [], actors: [], ratings: [], imdbRating: null, poster: null })
    expect(details.type).toBe('series')
  })
})

describe('searchMovies', () => {
  it('sends filters and parses, dedupes and caches results', async () => {
    const calls = mockFetch({
      'www.omdbapi.com': () =>
        jsonResponse(
          searchResponse([searchItem(1), searchItem(1), searchItem(2, { Poster: 'N/A', Type: 'episode' })], 42)
        )
    })
    const page = await searchMovies({ query: 'batman', type: 'movie', year: '1989', page: 2 }, 'k')
    expect(page.total).toBe(42)
    expect(page.items.map((m) => m.id)).toEqual(['tt1000001', 'tt1000002'])
    expect(page.items[1]).toMatchObject({ poster: null, type: 'episode' })
    const params = calls[0]?.searchParams
    expect(params?.get('s')).toBe('batman')
    expect(params?.get('type')).toBe('movie')
    expect(params?.get('y')).toBe('1989')
    expect(params?.get('page')).toBe('2')
    await searchMovies({ query: 'batman', type: 'movie', year: '1989', page: 2 }, 'k')
    expect(calls).toHaveLength(1)
  })

  it('treats "not found" and "too many" as empty', async () => {
    mockFetch({ 'www.omdbapi.com': () => jsonResponse({ Response: 'False', Error: 'Movie not found!' }) })
    await expect(searchMovies({ query: 'zz' }, 'k')).resolves.toEqual({ items: [], total: 0 })
  })

  it('falls back to the item count when totalResults is missing', async () => {
    mockFetch({ 'www.omdbapi.com': () => jsonResponse({ Response: 'True', Search: [searchItem(1)] }) })
    await expect(searchMovies({ query: 'one' }, 'k')).resolves.toMatchObject({ total: 1 })
  })

  it('throws other OMDb errors', async () => {
    mockFetch({ 'www.omdbapi.com': () => jsonResponse({ Response: 'False', Error: 'Invalid API key!' }) })
    await expect(searchMovies({ query: 'x' }, 'k')).rejects.toThrow('Invalid API key!')
    mockFetch({ 'www.omdbapi.com': () => jsonResponse({ Response: 'False' }) })
    await expect(searchMovies({ query: 'y' }, 'k')).rejects.toThrow('OMDb could not complete the search.')
  })

  it('needs a key', async () => {
    await expect(searchMovies({ query: 'x' }, null)).rejects.toMatchObject({ kind: 'missing-key' })
  })
})

describe('getMovie', () => {
  it('fetches the full plot once and caches it', async () => {
    const calls = mockFetch({ 'www.omdbapi.com': () => jsonResponse(movieResponse()) })
    const movie = await getMovie('tt0133093', 'k')
    expect(movie.title).toBe('The Matrix')
    expect(calls[0]?.searchParams.get('plot')).toBe('full')
    await getMovie('tt0133093', 'k')
    expect(calls).toHaveLength(1)
  })

  it('throws when OMDb has no such title', async () => {
    mockFetch({ 'www.omdbapi.com': () => jsonResponse({ Response: 'False', Error: 'Incorrect IMDb ID.' }) })
    await expect(getMovie('tt0', 'k')).rejects.toThrow('Incorrect IMDb ID.')
    mockFetch({ 'www.omdbapi.com': () => jsonResponse({ Response: 'False' }) })
    await expect(getMovie('tt00', 'k')).rejects.toThrow('OMDb could not find that title.')
  })
})
