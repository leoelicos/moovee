import type { MovieSummary } from '../api/types'
import { Poster } from './Poster'

const TYPE_LABEL = { movie: 'Movie', series: 'Series', episode: 'Episode' } as const

export function MovieCard({ movie, onOpen }: { movie: MovieSummary; onOpen: (movie: MovieSummary) => void }) {
  return (
    <button type='button' className='card' data-card onClick={() => onOpen(movie)}>
      <Poster src={movie.poster} title={movie.title} />
      <span className='card__body'>
        <span className='card__title'>{movie.title}</span>
        {/* Hidden commas keep the button's name readable: "Heat, 1995, Series". */}
        <span className='visually-hidden'>, </span>
        <span className='card__meta'>
          <span>{movie.year}</span>
          {movie.type !== 'movie' ? (
            <span className='chip chip--small'>
              <span className='visually-hidden'>, </span>
              {TYPE_LABEL[movie.type]}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  )
}
