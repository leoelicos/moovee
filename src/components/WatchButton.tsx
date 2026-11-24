import type { MovieSummary } from '../api/types'
import { useWatchlist } from '../hooks/useWatchlist'
import { toggleWatchlist } from '../lib/watchlist'
import { Icon } from './Icon'

/** Toggle button: aria-pressed tells assistive tech whether the title is saved. */
export function WatchButton({ movie }: { movie: MovieSummary }) {
  const saved = useWatchlist().some((item) => item.id === movie.id)
  return (
    <button
      type='button'
      className={`button ${saved ? 'button--saved' : ''}`}
      aria-pressed={saved}
      onClick={() => toggleWatchlist(movie)}>
      <Icon name={saved ? 'bookmarkFilled' : 'bookmark'} />
      {saved ? 'On your watchlist' : 'Add to watchlist'}
    </button>
  )
}
