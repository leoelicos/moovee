import type { MovieSummary } from '../api/types'
import { handleGridKeys } from '../lib/grid'
import { MovieCard } from './MovieCard'

export function ResultsGrid({ items, onOpen }: { items: MovieSummary[]; onOpen: (movie: MovieSummary) => void }) {
  return (
    // The list only forwards arrow keys to its buttons; each card is the interactive element.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <ul className='grid' aria-label='Results' onKeyDown={handleGridKeys}>
      {items.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  )
}
