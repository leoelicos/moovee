import { jsonResponse, mockFetch, tmdbResponse, tmdbTvResponse } from '../test/fixtures'
import { getSimilar, getTrending, toTrending } from './tmdb'

describe('getTrending', () => {
  it('maps trending movies with image URLs and caches them', async () => {
    const calls = mockFetch({ 'api.themoviedb.org': () => jsonResponse(tmdbResponse) })
    const movies = await getTrending('k')
    expect(movies[0]).toEqual({
      id: 1,
      kind: 'movie',
      title: 'Dune: Part Two',
      year: '2024',
      overview: 'Paul Atreides unites with the Fremen.',
      poster: 'https://image.tmdb.org/t/p/w342/dune.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/dune-bg.jpg',
      rating: 8.2
    })
    expect(movies[1]).toMatchObject({ poster: null, backdrop: null, rating: null })
    expect(calls[0]?.pathname).toBe('/3/trending/movie/week')
    expect(calls[0]?.searchParams.get('api_key')).toBe('k')
    await getTrending('k')
    expect(calls).toHaveLength(1)
  })

  it('maps series names and air dates', async () => {
    const calls = mockFetch({ 'api.themoviedb.org': () => jsonResponse(tmdbTvResponse) })
    const shows = await getTrending('k', undefined, 'series')
    expect(calls[0]?.pathname).toBe('/3/trending/tv/week')
    expect(shows[0]).toMatchObject({ kind: 'series', title: 'The Last of Us', year: '2023' })
  })

  it('handles missing fields and empty pages', async () => {
    expect(toTrending({ id: 9 })).toMatchObject({ title: 'Untitled', year: '', overview: '', rating: null })
    mockFetch({ 'api.themoviedb.org': () => jsonResponse({}) })
    await expect(getTrending('k')).resolves.toEqual([])
  })

  it('needs a key', async () => {
    await expect(getTrending(null)).rejects.toMatchObject({ kind: 'missing-key' })
  })
})

describe('getSimilar', () => {
  it('finds the TMDB id from the IMDb id, then fetches recommendations', async () => {
    const calls = mockFetch({
      'api.themoviedb.org': (url) =>
        url.pathname.includes('/find/') ? jsonResponse({ movie_results: [{ id: 603 }] }) : jsonResponse(tmdbResponse)
    })
    const similar = await getSimilar('tt0133093', 'k', undefined, 2)
    expect(calls[0]?.pathname).toBe('/3/find/tt0133093')
    expect(calls[0]?.searchParams.get('external_source')).toBe('imdb_id')
    expect(calls[1]?.pathname).toBe('/3/movie/603/recommendations')
    expect(similar.map((m) => m.title)).toEqual(['Dune: Part Two', 'Wicked'])
    await getSimilar('tt0133093', 'k')
    expect(calls).toHaveLength(2)
  })

  it('uses the tv endpoint for series and returns nothing for unknown ids', async () => {
    const calls = mockFetch({
      'api.themoviedb.org': (url) =>
        url.pathname.includes('/find/tt1')
          ? jsonResponse({ movie_results: [], tv_results: [{ id: 7 }] })
          : url.pathname.includes('/find/')
            ? jsonResponse({})
            : jsonResponse({})
    })
    await expect(getSimilar('tt1', 'k')).resolves.toEqual([])
    expect(calls[1]?.pathname).toBe('/3/tv/7/recommendations')
    await expect(getSimilar('tt2', 'k')).resolves.toEqual([])
    await expect(getSimilar('tt3', null)).rejects.toMatchObject({ kind: 'missing-key' })
  })
})
