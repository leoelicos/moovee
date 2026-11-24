import { getMovie } from '../api/omdb'
import type { MovieDetails } from '../api/types'
import { useAsync } from '../hooks/useAsync'
import { keys } from '../lib/env'
import { Dialog } from './Dialog'
import { Icon } from './Icon'
import { Poster } from './Poster'
import { ErrorMessage } from './States'
import { Trailer } from './Trailer'

export function MovieDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const details = useAsync(id, (signal) => getMovie(id, keys.omdb, signal))
  return (
    <Dialog labelledBy='movie-title' onClose={onClose} className='dialog--movie'>
      <div className='dialog__bar'>
        <button type='button' className='icon-button' aria-label='Close details' onClick={onClose}>
          <Icon name='close' />
        </button>
      </div>
      {details.status === 'success' ? (
        <MovieBody movie={details.data} />
      ) : details.status === 'error' ? (
        <>
          <h2 id='movie-title' className='visually-hidden'>
            Title details
          </h2>
          <ErrorMessage error={details.error} onRetry={details.retry} />
        </>
      ) : (
        <div className='detail detail--loading' aria-busy='true'>
          <h2 id='movie-title' className='visually-hidden'>
            Loading title details
          </h2>
          <p role='status' className='visually-hidden'>
            Loading details…
          </p>
          <div className='trailer skeleton' />
          <div className='skeleton skeleton--line' />
          <div className='skeleton skeleton--line skeleton--short' />
        </div>
      )}
    </Dialog>
  )
}

function Meter({ source, value, score }: { source: string; value: string; score: number | null }) {
  return (
    <li className='rating'>
      <span className='rating__source'>{source}</span>
      <span className='rating__value'>{value}</span>
      {score !== null ? (
        <span className='rating__bar' aria-hidden='true'>
          <span style={{ inlineSize: `${Math.min(100, score)}%` }} />
        </span>
      ) : null}
    </li>
  )
}

export function MovieBody({ movie }: { movie: MovieDetails }) {
  const facts: [string, string | null][] = [
    ['Director', movie.director],
    ['Writer', movie.writer],
    ['Starring', movie.actors.join(', ') || null],
    ['Released', movie.released],
    ['Language', movie.language],
    ['Country', movie.country],
    ['Box office', movie.boxOffice],
    ['Seasons', movie.totalSeasons],
    ['Awards', movie.awards]
  ]
  const meta = [movie.year, movie.rated, movie.runtime].filter(Boolean)
  return (
    <article className='detail'>
      <Trailer key={movie.id} title={movie.title} year={movie.year} />
      <div className='detail__main'>
        <Poster src={movie.poster} title={movie.title} decorative={false} className='detail__poster' eager />
        <div className='detail__info'>
          <h2 id='movie-title' className='detail__title'>
            {movie.title}
          </h2>
          <p className='detail__meta'>{meta.join(' · ')}</p>
          {movie.genres.length ? (
            <ul className='chips' aria-label='Genres'>
              {movie.genres.map((genre) => (
                <li key={genre} className='chip'>
                  {genre}
                </li>
              ))}
            </ul>
          ) : null}
          {movie.ratings.length ? (
            <ul className='ratings' aria-label='Ratings'>
              {movie.ratings.map((r) => (
                <Meter key={r.source} {...r} />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {movie.plot ? <p className='detail__plot'>{movie.plot}</p> : null}
      <dl className='facts'>
        {facts
          .filter((fact): fact is [string, string] => fact[1] !== null)
          .map(([label, value]) => (
            <div key={label} className='facts__row'>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
      <p>
        <a className='button' href={`https://www.imdb.com/title/${movie.id}/`} target='_blank' rel='noreferrer'>
          View on IMDb <Icon name='external' />
          <span className='visually-hidden'> (opens in a new tab)</span>
        </a>
      </p>
    </article>
  )
}
