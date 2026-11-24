import type { Page, Route } from '@playwright/test'

/**
 * Deterministic stand-ins for OMDb, TMDB, YouTube and the image CDNs.
 * Every external request is answered here or aborted, so e2e never needs real keys or network.
 */

export const STAR_TITLES: [string, string, string][] = [
  ['Star Wars: Episode IV - A New Hope', '1977', 'movie'],
  ['Star Wars: Episode V - The Empire Strikes Back', '1980', 'movie'],
  ['Star Trek', '2009', 'movie'],
  ['A Star Is Born', '2018', 'movie'],
  ['Star Wars: The Clone Wars', '2008–2020', 'series'],
  ['Stardust', '2007', 'movie'],
  ['Star Trek: The Next Generation', '1987–1994', 'series'],
  ['Lone Star', '1996', 'movie'],
  ['Star Wars: Episode VI - Return of the Jedi', '1983', 'movie'],
  ['Rogue One: A Star Wars Story', '2016', 'movie'],
  ['Star Trek Into Darkness', '2013', 'movie'],
  ['Dark Star', '1974', 'movie'],
  ['Star Wars: Andor', '2022–2025', 'series'],
  ['Twinkle Twinkle Lucky Stars', '1985', 'movie'],
  ['Star Trek: Discovery', '2017–2024', 'series'],
  ['Starship Troopers', '1997', 'movie'],
  ['Star Wars: The Force Awakens', '2015', 'movie'],
  ['The Lucky Star', '1980', 'movie'],
  ['Star Trek: Picard', '2020–2023', 'series'],
  ['Stargate', '1994', 'movie'],
  ['Star Kid', '1997', 'movie'],
  ['Stars and Bars', '1988', 'movie'],
  ['Star Trek Beyond', '2016', 'movie'],
  ['Wish Upon a Star', '1996', 'movie']
]

export const NO_POSTER_ID = 'tt9000006' // Stardust: OMDb says "N/A"
export const BROKEN_POSTER_ID = 'tt9000008' // Lone Star: image URL 404s
export const FIRST_ID = 'tt9000001'

const idOf = (index: number) => `tt${9000001 + index}`

const PALETTE = ['#f97316', '#0ea5e9', '#a855f7', '#22c55e', '#e11d48', '#eab308', '#14b8a6', '#6366f1']

export function posterSvg(label: string, seed: number, wide = false): string {
  const [w, h] = wide ? [1280, 720] : [300, 450]
  const a = PALETTE[seed % PALETTE.length]
  const b = PALETTE[(seed + 3) % PALETTE.length]
  const safe = label.replace(/[<>&"]/g, '')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<circle cx="${w * 0.75}" cy="${h * 0.3}" r="${Math.min(w, h) * 0.22}" fill="rgba(255,255,255,0.18)"/>
<text x="24" y="${h - 40}" font-family="system-ui,sans-serif" font-weight="800" font-size="${wide ? 56 : 30}" fill="white">${safe.slice(0, wide ? 30 : 16)}</text>
</svg>`
}

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

export interface MockOptions {
  omdb?: 'ok' | 'error' | 'invalid-key'
  tmdb?: 'ok' | 'error'
  youtube?: 'ok' | 'none' | 'error'
  /** Milliseconds to hold each OMDb answer, to observe skeletons. */
  omdbDelay?: number
}

export interface MockLog {
  omdb: URL[]
  youtube: URL[]
}

function searchBody(url: URL) {
  const query = (url.searchParams.get('s') ?? '').toLowerCase()
  const type = url.searchParams.get('type')
  const year = url.searchParams.get('y')
  const page = Number(url.searchParams.get('page') ?? '1')
  if (query.includes('zzz')) return { Response: 'False', Error: 'Movie not found!' }
  const all = STAR_TITLES.map(([title, y, kind], i) => ({
    Title: title,
    Year: y,
    imdbID: idOf(i),
    Type: kind,
    Poster: idOf(i) === NO_POSTER_ID ? 'N/A' : `https://m.media-amazon.com/images/M/${idOf(i)}.svg`
  }))
    .filter((m) => (query.includes('star') ? true : m.Title.toLowerCase().includes(query)))
    .filter((m) => (type ? m.Type === type : true))
    .filter((m) => (year ? m.Year.startsWith(year) : true))
  if (all.length === 0) return { Response: 'False', Error: 'Movie not found!' }
  return { Response: 'True', Search: all.slice((page - 1) * 10, page * 10), totalResults: String(all.length) }
}

function detailBody(id: string) {
  const index = Number(id.slice(2)) - 9000001
  const entry = STAR_TITLES[index]
  if (!entry) return { Response: 'False', Error: 'Incorrect IMDb ID.' }
  const [title, year, kind] = entry
  return {
    Response: 'True',
    Title: title,
    Year: year,
    Rated: 'PG',
    Released: `25 May ${year.slice(0, 4)}`,
    Runtime: '121 min',
    Genre: 'Action, Adventure, Sci-Fi',
    Director: 'George Lucas',
    Writer: 'George Lucas',
    Actors: 'Mark Hamill, Harrison Ford, Carrie Fisher',
    Plot: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire’s world-destroying battle station.',
    Language: 'English',
    Country: 'United States',
    Awards: 'Won 6 Oscars. 66 wins & 31 nominations total',
    Poster: id === NO_POSTER_ID ? 'N/A' : `https://m.media-amazon.com/images/M/${id}.svg`,
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.6/10' },
      { Source: 'Rotten Tomatoes', Value: '93%' },
      { Source: 'Metacritic', Value: '90/100' }
    ],
    imdbRating: '8.6',
    imdbVotes: '1,453,206',
    imdbID: id,
    Type: kind,
    BoxOffice: '$460,998,507',
    ...(kind === 'series' ? { totalSeasons: '7' } : {})
  }
}

export const TRENDING = [
  ['Dune: Part Two', '2024-02-27', 8.2],
  ['Wicked', '2024-11-20', 7.4],
  ['Gladiator II', '2024-11-13', 6.8],
  ['Moana 2', '2024-11-21', 7.1],
  ['The Wild Robot', '2024-09-12', 8.4],
  ['Venom: The Last Dance', '2024-10-22', 6.5],
  ['Inside Out 2', '2024-06-11', 7.6],
  ['Deadpool & Wolverine', '2024-07-24', 7.7],
  ['Alien: Romulus', '2024-08-13', 7.2]
] as const

export const TRENDING_TV = [
  ['The Last of Us', '2023-01-15', 8.6],
  ['Severance', '2022-02-17', 8.4],
  ['Shōgun', '2024-02-27', 8.7],
  ['The Bear', '2022-06-23', 8.2],
  ['Arcane', '2021-11-06', 9.0],
  ['Slow Horses', '2022-04-01', 8.1]
] as const

export const SIMILAR = [
  ['The Empire Strikes Back', '1980-05-20', 8.4],
  ['Return of the Jedi', '1983-05-25', 7.9],
  ['Raiders of the Lost Ark', '1981-06-12', 7.9],
  ['Alien', '1979-05-25', 8.2],
  ['Blade Runner', '1982-06-25', 7.9],
  ['E.T. the Extra-Terrestrial', '1982-06-11', 7.5]
] as const

export async function mockApis(page: Page, options: MockOptions = {}): Promise<MockLog> {
  const log: MockLog = { omdb: [], youtube: [] }
  const { omdb = 'ok', tmdb = 'ok', youtube = 'ok', omdbDelay = 0 } = options

  // Anything not mocked below must not leave the machine.
  await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (route) => route.abort())

  await page.route('https://www.omdbapi.com/**', async (route) => {
    const url = new URL(route.request().url())
    log.omdb.push(url)
    if (omdbDelay) await new Promise((r) => setTimeout(r, omdbDelay))
    if (omdb === 'error') return route.fulfill({ status: 503, body: 'Service unavailable' })
    if (omdb === 'invalid-key') return json(route, { Response: 'False', Error: 'Invalid API key!' })
    const id = url.searchParams.get('i')
    return json(route, id ? detailBody(id) : searchBody(url))
  })

  await page.route('https://api.themoviedb.org/**', (route) => {
    if (tmdb === 'error') return route.fulfill({ status: 500, body: 'error' })
    const path = new URL(route.request().url()).pathname
    if (path.includes('/find/')) return json(route, { movie_results: [{ id: 11 }], tv_results: [] })
    const list = path.includes('/trending/tv') ? TRENDING_TV : path.includes('/recommendations') ? SIMILAR : TRENDING
    const offset = list === TRENDING ? 0 : list === TRENDING_TV ? 20 : 40
    return json(route, {
      results: list.map(([title, date, vote], i) => ({
        id: offset + i + 1,
        ...(list === TRENDING_TV ? { name: title, first_air_date: date } : { title, release_date: date }),
        overview:
          offset + i === 0
            ? 'Paul Atreides unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.'
            : `${title} overview.`,
        poster_path: `/poster-${offset + i}.svg`,
        backdrop_path: `/backdrop-${offset + i}.svg`,
        vote_average: vote
      }))
    })
  })

  await page.route('https://image.tmdb.org/**', (route) => {
    const url = route.request().url()
    const index = Number(/-(\d+)\.svg$/.exec(url)?.[1] ?? 0)
    const wide = url.includes('backdrop')
    const all = [...TRENDING, ...Array(20 - TRENDING.length).fill(['', '', 0]), ...TRENDING_TV]
    const title = index >= 40 ? SIMILAR[index - 40]?.[0] : all[index]?.[0]
    return route.fulfill({ contentType: 'image/svg+xml', body: posterSvg(title || 'Poster', index, wide) })
  })

  await page.route('https://m.media-amazon.com/**', (route) => {
    const id = /(tt\d+)/.exec(route.request().url())?.[1] ?? ''
    if (id === BROKEN_POSTER_ID) return route.fulfill({ status: 404, body: '' })
    const index = Number(id.slice(2)) - 9000001
    return route.fulfill({ contentType: 'image/svg+xml', body: posterSvg(STAR_TITLES[index]?.[0] ?? id, index) })
  })

  await page.route('https://www.googleapis.com/youtube/**', (route) => {
    log.youtube.push(new URL(route.request().url()))
    if (youtube === 'error') return route.fulfill({ status: 403, body: 'quotaExceeded' })
    return json(route, { items: youtube === 'none' ? [] : [{ id: { kind: 'youtube#video', videoId: 'vZ734NWnAHA' } }] })
  })

  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html lang="en"><meta charset="utf-8"><title>Trailer</title><body style="margin:0;background:#000;color:#fff;display:grid;place-items:center;height:100vh;font:24px system-ui"><p>▶ Mock trailer playing</p></body></html>'
    })
  )

  return log
}
