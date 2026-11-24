import { Link } from 'react-router'
import { ResultsGrid } from '../components/ResultsGrid'
import { Message } from '../components/States'
import { useMovieDialog } from '../hooks/useMovieDialog'
import { useWatchlist } from '../hooks/useWatchlist'

export function WatchlistPage() {
  const items = useWatchlist()
  const dialog = useMovieDialog()
  return (
    <div className='page'>
      <div className='results-header'>
        <h1 className='results-header__title'>Your watchlist</h1>
      </div>
      <p className='results-count' role='status'>
        {items.length === 0 ? '' : `${items.length} saved on this device`}
      </p>
      {items.length === 0 ? (
        <Message
          title='Nothing saved yet'
          action={
            <Link className='button button--primary' to='/'>
              Find something to watch
            </Link>
          }>
          <p>Open any title and choose “Add to watchlist”. It stays on this device, no account needed.</p>
        </Message>
      ) : (
        <ResultsGrid items={items} onOpen={(movie) => dialog.open(movie.id)} />
      )}
    </div>
  )
}
