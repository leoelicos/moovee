import { jsonResponse, mockFetch, tmdbResponse } from '../test/fixtures'
import { getTrending, toTrending } from './tmdb'

describe('tmdb', () => {
  it('maps popular movies with image URLs and caches them', async () => {
    const calls = mockFetch({ 'api.themoviedb.org': () => jsonResponse(tmdbResponse) })
    const movies = await getTrending('k')
    expect(movies[0]).toEqual({
      id: 1,
      title: 'Dune: Part Two',
      year: '2024',
      overview: 'Paul Atreides unites with the Fremen.',
      poster: 'https://image.tmdb.org/t/p/w342/dune.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/dune-bg.jpg',
      rating: 8.2
    })
    expect(movies[1]).toMatchObject({ poster: null, backdrop: null, rating: null })
    expect(calls[0]?.searchParams.get('api_key')).toBe('k')
    await getTrending('k')
    expect(calls).toHaveLength(1)
  })

  it('handles missing fields and empty pages', async () => {
    expect(toTrending({ id: 9, title: 'X' })).toMatchObject({ year: '', overview: '', rating: null })
    mockFetch({ 'api.themoviedb.org': () => jsonResponse({}) })
    await expect(getTrending('k')).resolves.toEqual([])
  })

  it('needs a key', async () => {
    await expect(getTrending(null)).rejects.toMatchObject({ kind: 'missing-key' })
  })
})
