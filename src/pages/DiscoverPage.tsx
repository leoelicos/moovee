import { Link } from 'react-router'
import { getTrending } from '../api/tmdb'
import type { TrendingMovie } from '../api/types'
import { Icon } from '../components/Icon'
import { Poster } from '../components/Poster'
import { RecentSearches } from '../components/RecentSearches'
import { useAsync } from '../hooks/useAsync'
import { keys } from '../lib/env'
import { QUICK_PICKS, searchHref } from '../lib/query'

export function DiscoverPage() {
  const trending = useAsync('popular', (signal) => getTrending(keys.tmdb, signal))
  const movies = trending.status === 'success' ? trending.data : []
  const [hero, ...rest] = movies

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

      <section className='section' aria-labelledby='trending-title' aria-busy={trending.status === 'loading'}>
        <div className='section__header'>
          <h2 id='trending-title' className='section__title'>
            {trending.status === 'error' ? 'Try one of these' : 'Popular right now'}
          </h2>
        </div>
        {trending.status === 'loading' ? (
          <ul className='rail' aria-hidden='true' data-testid='rail-skeleton'>
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i} className='rail__item'>
                <div className='poster skeleton' />
              </li>
            ))}
          </ul>
        ) : null}
        {trending.status === 'error' ? (
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
        {rest.length > 0 ? (
          <ul className='rail'>
            {rest.map((movie, index) => (
              <li key={movie.id} className='rail__item'>
                <Link className='rail__link' to={searchHref({ q: movie.title })} viewTransition>
                  <Poster src={movie.poster} title={movie.title} eager={index < 4} />
                  <span className='rail__title'>{movie.title}</span>
                  <span className='rail__meta'>
                    {movie.year}
                    {movie.rating !== null ? (
                      <>
                        {' · '}
                        <Icon name='star' className='star' /> {movie.rating.toFixed(1)}
                      </>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
        <p className='hero__eyebrow'>#1 popular this week</p>
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
