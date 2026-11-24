import { jsonResponse, mockFetch, movieResponse, searchItem, tmdbResponse, tmdbTvResponse } from './fixtures'

export interface AppMockOptions {
  total?: number
  omdbFail?: boolean
  tmdbFail?: boolean
  trailer?: 'ok' | 'none' | 'error'
}

/** Fetch mock for whole-app tests: 10 results per page, `zzz` finds nothing. */
export function mockAppApis({ total = 25, omdbFail = false, tmdbFail = false, trailer = 'ok' }: AppMockOptions = {}) {
  return mockFetch({
    'www.omdbapi.com': (url) => {
      if (omdbFail) return jsonResponse({}, 500)
      const id = url.searchParams.get('i')
      if (id) return jsonResponse(movieResponse({ imdbID: id, Title: `Title ${id}` }))
      const q = url.searchParams.get('s') ?? ''
      if (q.includes('zzz')) return jsonResponse({ Response: 'False', Error: 'Movie not found!' })
      const page = Number(url.searchParams.get('page'))
      const count = Math.max(0, Math.min(10, total - (page - 1) * 10))
      const items = Array.from({ length: count }, (_, i) =>
        searchItem((page - 1) * 10 + i + 1, { Title: `${q} ${(page - 1) * 10 + i + 1}` })
      )
      return jsonResponse({ Response: 'True', Search: items, totalResults: String(total) })
    },
    'api.themoviedb.org': (url) => {
      if (tmdbFail) return jsonResponse({}, 500)
      if (url.pathname.includes('/trending/tv')) return jsonResponse(tmdbTvResponse)
      if (url.pathname.includes('/find/')) return jsonResponse({ movie_results: [{ id: 603 }], tv_results: [] })
      if (url.pathname.includes('/recommendations')) return jsonResponse(tmdbResponse)
      return jsonResponse(tmdbResponse)
    },
    'www.googleapis.com': () =>
      trailer === 'error'
        ? jsonResponse({}, 403)
        : jsonResponse({ items: trailer === 'none' ? [] : [{ id: { videoId: 'vid123' } }] })
  })
}
