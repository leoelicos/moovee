import { Link } from 'react-router'
import type { TrendingMovie } from '../api/types'
import { searchHref } from '../lib/query'
import { Icon } from './Icon'
import { Poster } from './Poster'

/** Horizontally scrolling posters; each links to a search for that title. */
export function TitleRail({ items, label, eager = 0 }: { items: TrendingMovie[]; label: string; eager?: number }) {
  return (
    <ul className='rail' aria-label={label}>
      {items.map((movie, index) => (
        <li key={`${movie.kind}-${movie.id}`} className='rail__item'>
          <Link
            className='rail__link'
            to={searchHref({ q: movie.title, type: movie.kind === 'series' ? 'series' : 'all' })}
            viewTransition>
            <Poster src={movie.poster} title={movie.title} eager={index < eager} />
            <span className='rail__title'>{movie.title}</span>
            <span className='rail__meta'>
              {movie.year || '—'}
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
  )
}

export function RailSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className='rail' aria-hidden='true' data-testid='rail-skeleton'>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className='rail__item'>
          <div className='poster skeleton' />
        </li>
      ))}
    </ul>
  )
}
