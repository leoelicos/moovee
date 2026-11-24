import type { MovieSummary } from '../api/types'
import { cleanQuery, parseSearch, searchHref, sortMovies, toSearchParams } from './query'

describe('cleanQuery', () => {
  it('keeps letters in any language, drops odd characters and squashes spaces', () => {
    expect(cleanQuery('  ¡Que   Viva México! <script> ')).toBe('Que Viva México! script')
    expect(cleanQuery('Amélie')).toBe('Amélie')
  })
})

describe('parseSearch / toSearchParams', () => {
  it('round-trips valid state', () => {
    const state = parseSearch(new URLSearchParams('q=alien&type=series&y=1979&sort=newest&m=tt0078748'))
    expect(state).toEqual({ q: 'alien', type: 'series', year: '1979', sort: 'newest', m: 'tt0078748' })
    expect(toSearchParams(state).toString()).toBe('q=alien&type=series&y=1979&sort=newest&m=tt0078748')
  })

  it('ignores invalid values', () => {
    expect(parseSearch(new URLSearchParams('type=x&y=99&sort=up&m=123'))).toEqual({
      q: '',
      type: 'all',
      year: '',
      sort: 'relevance',
      m: null
    })
  })

  it('leaves defaults out of links', () => {
    expect(searchHref({ q: 'up', type: 'all', sort: 'relevance', year: '', m: null })).toBe('/search?q=up')
    expect(searchHref({})).toBe('/')
  })
})

describe('sortMovies', () => {
  const m = (title: string, year: string): MovieSummary => ({ id: title, title, year, type: 'movie', poster: null })
  const items = [m('B', '2001'), m('A', '1999–2004'), m('C', '2010')]
  it.each([
    ['relevance', ['B', 'A', 'C']],
    ['newest', ['C', 'B', 'A']],
    ['oldest', ['A', 'B', 'C']],
    ['title', ['A', 'B', 'C']]
  ] as const)('%s', (sort, order) => {
    expect(sortMovies(items, sort).map((x) => x.title)).toEqual(order)
  })

  it('best match keeps API order but lifts titles with posters', () => {
    const withPoster = { ...m('P', '1990'), poster: 'https://x.test/p.jpg' }
    expect(sortMovies([m('N', '2000'), withPoster, m('O', '2001')], 'relevance').map((x) => x.title)).toEqual([
      'P',
      'N',
      'O'
    ])
  })

  it('puts unknown years last when newest first', () => {
    expect(sortMovies([m('X', '????'), m('Y', '2000')], 'newest').map((x) => x.title)).toEqual(['Y', 'X'])
  })
})
