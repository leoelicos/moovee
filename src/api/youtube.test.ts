import { jsonResponse, mockFetch } from '../test/fixtures'
import { embedUrl, findTrailer, youtubeSearchUrl } from './youtube'

describe('youtube', () => {
  it('finds a trailer and caches it on the device, including misses', async () => {
    const calls = mockFetch({
      'www.googleapis.com': (url) =>
        jsonResponse({ items: url.searchParams.get('q')?.includes('Nothing') ? [] : [{ id: { videoId: 'abc' } }] })
    })
    await expect(findTrailer('Alien', '1979', 'k')).resolves.toBe('abc')
    expect(calls[0]?.searchParams.get('q')).toBe('Alien 1979 official trailer')
    expect(calls[0]?.searchParams.get('videoEmbeddable')).toBe('true')
    await expect(findTrailer('alien', '1979', 'k')).resolves.toBe('abc')
    await expect(findTrailer('Nothing', '2000', 'k')).resolves.toBeNull()
    await expect(findTrailer('Nothing', '2000', null)).resolves.toBeNull()
    expect(calls).toHaveLength(2)
  })

  it('needs a key when not cached', async () => {
    await expect(findTrailer('X', '1', null)).rejects.toMatchObject({ kind: 'missing-key' })
  })

  it('ignores a corrupt or blocked cache', async () => {
    localStorage.setItem('moovee:trailers', '{oops')
    mockFetch({ 'www.googleapis.com': () => jsonResponse({}) })
    await expect(findTrailer('Y', '2', 'k')).resolves.toBeNull()
    localStorage.setItem('moovee:trailers', '"str"')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full')
    })
    await expect(findTrailer('Z', '3', 'k')).resolves.toBeNull()
  })

  it('builds privacy-friendly embed and search URLs', () => {
    expect(embedUrl('a b')).toBe('https://www.youtube-nocookie.com/embed/a%20b?autoplay=1&rel=0&modestbranding=1')
    expect(youtubeSearchUrl('Up', '2009')).toBe('https://www.youtube.com/results?search_query=Up+2009+trailer')
  })
})
