import { Link, useSearchParams } from 'react-router'
import { getTrending, type TrendingKind } from '../api/tmdb'
import type { TrendingMovie } from '../api/types'
import { Icon } from '../components/Icon'
import { RecentSearches } from '../components/RecentSearches'
import { RailSkeleton, TitleRail } from '../components/TitleRail'
import { useAsync } from '../hooks/useAsync'
import { keys } from '../lib/env'
import { QUICK_PICKS, searchHref } from '../lib/query'

const TABS: { value: TrendingKind; label: string }[] = [
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'Series' }
]

export function DiscoverPage() {
  const [params, setParams] = useSearchParams()
  const kind: TrendingKind = params.get('t') === 'series' ? 'series' : 'movie'
  const movies = useAsync('trending:movie', (signal) => getTrending(keys.tmdb, signal, 'movie'))
  const rail = useAsync(`trending:${kind}`, (signal) => getTrending(keys.tmdb, signal, kind))
  const hero = movies.status === 'success' ? movies.data[0] : undefined
  const items = rail.status === 'success' ? rail.data.filter((m) => m.id !== hero?.id || m.kind !== hero.kind) : []

  const choose = (next: TrendingKind) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev)
        if (next === 'series') p.set('t', 'series')
        else p.delete('t')
        return p
      },
      { replace: true }
    )

  return (
    <div className='page page--discover'>
      {hero ? (
        <Hero movie={hero} />
      ) : (
        <section className='hero hero--plain' aria-labelledby='hero-title'>
          <div className='hero__content'>
            <h1 id='hero-title' className='hero__title'>
              Find any trailer, fast.
            </h1>
            <p className='hero__text'>
              Start typing a title. Press <kbd>/</kbd> from anywhere to search.
            </p>
          </div>
        </section>
      )}

      <RecentSearches />

      <section className='section' aria-labelledby='trending-title' aria-busy={rail.status === 'loading'}>
        <div className='section__header'>
          <h2 id='trending-title' className='section__title'>
            {rail.status === 'error' ? 'Try one of these' : 'Trending this week'}
          </h2>
          {rail.status !== 'error' ? (
            <fieldset className='segmented segmented--small'>
              <legend className='visually-hidden'>Trending type</legend>
              {TABS.map((tab) => (
                <label key={tab.value} className='segmented__option'>
                  <input
                    type='radio'
                    name='trending-kind'
                    value={tab.value}
                    checked={kind === tab.value}
                    onChange={() => choose(tab.value)}
                  />
                  <span>{tab.label}</span>
                </label>
              ))}
            </fieldset>
          ) : null}
        </div>
        {rail.status === 'loading' ? <RailSkeleton /> : null}
        {rail.status === 'error' ? (
          <ul className='chips'>
            {QUICK_PICKS.map((title) => (
              <li key={title} className='chip chip--link'>
                <Link to={searchHref({ q: title })} viewTransition>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {items.length > 0 ? (
          <TitleRail items={items} label={`Trending ${kind === 'series' ? 'series' : 'movies'}`} eager={4} />
        ) : null}
      </section>
    </div>
  )
}

function Hero({ movie }: { movie: TrendingMovie }) {
  return (
    <section className='hero' aria-labelledby='hero-title'>
      {movie.backdrop ? (
        <img className='hero__backdrop' src={movie.backdrop} alt='' width={1280} height={720} fetchPriority='high' />
      ) : null}
      <div className='hero__content'>
        <p className='hero__eyebrow'>#1 trending this week</p>
        <h1 id='hero-title' className='hero__title'>
          {movie.title}
        </h1>
        <p className='hero__meta'>
          {movie.year}
          {movie.rating !== null ? (
            <>
              {' · '}
              <Icon name='star' className='star' /> {movie.rating.toFixed(1)} on TMDB
            </>
          ) : null}
        </p>
        {movie.overview ? <p className='hero__text'>{movie.overview}</p> : null}
        <Link className='button button--primary button--large' to={searchHref({ q: movie.title })} viewTransition>
          <Icon name='play' /> Find the trailer
        </Link>
      </div>
    </section>
  )
}
