import { getWatchlist, inWatchlist, removeFromWatchlist, toggleWatchlist, WATCHLIST_EVENT } from './watchlist'

const movie = (id: string) => ({ id, title: `T ${id}`, year: '2001', type: 'movie' as const, poster: null })

describe('watchlist', () => {
  it('toggles titles, newest first, and announces changes', () => {
    const listener = vi.fn()
    window.addEventListener(WATCHLIST_EVENT, listener)
    expect(toggleWatchlist(movie('a'), 1)).toBe(true)
    expect(toggleWatchlist({ ...movie('b'), extra: 'dropped' } as never, 2)).toBe(true)
    expect(getWatchlist().map((m) => m.id)).toEqual(['b', 'a'])
    expect(getWatchlist()[0]).not.toHaveProperty('extra')
    expect(inWatchlist('a')).toBe(true)
    expect(toggleWatchlist(movie('a'))).toBe(false)
    expect(inWatchlist('a')).toBe(false)
    removeFromWatchlist('b')
    expect(getWatchlist()).toEqual([])
    expect(listener).toHaveBeenCalledTimes(4)
    window.removeEventListener(WATCHLIST_EVENT, listener)
  })

  it('ignores corrupt data and blocked storage', () => {
    localStorage.setItem('moovee:watchlist', '{bad')
    expect(getWatchlist()).toEqual([])
    localStorage.setItem('moovee:watchlist', JSON.stringify([{ id: 1 }, null, movie('ok'), 'x']))
    expect(getWatchlist().map((m) => m.id)).toEqual(['ok'])
    localStorage.setItem('moovee:watchlist', '{"a":1}')
    expect(getWatchlist()).toEqual([])
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => toggleWatchlist(movie('z'))).not.toThrow()
  })
})
