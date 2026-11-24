import { Link } from 'react-router'
import { useWatchlist } from '../hooks/useWatchlist'
import { Icon } from './Icon'
import { SearchBox } from './SearchBox'
import { ThemeToggle } from './ThemeToggle'

export function Header({ onShowShortcuts, onShowPalette }: { onShowShortcuts: () => void; onShowPalette: () => void }) {
  const saved = useWatchlist().length
  return (
    <header className='header'>
      <div className='header__inner'>
        <Link to='/' className='brand' aria-label='Moovee home' viewTransition>
          <span className='brand__mark' aria-hidden='true'>
            <Icon name='play' />
          </span>
          <span className='brand__name'>moovee</span>
        </Link>
        <SearchBox />
        <div className='header__actions'>
          <Link
            to='/watchlist'
            className='icon-button icon-button--badge'
            aria-label={saved ? `Watchlist, ${saved} saved` : 'Watchlist'}
            title='Watchlist'
            viewTransition>
            <Icon name='bookmark' />
            {saved ? (
              <span className='badge' aria-hidden='true'>
                {saved > 99 ? '99+' : saved}
              </span>
            ) : null}
          </Link>
          <button
            type='button'
            className='icon-button hide-narrow'
            aria-label='Command palette'
            title='Command palette (Ctrl+K)'
            onClick={onShowPalette}>
            <Icon name='command' />
          </button>
          <button
            type='button'
            className='icon-button hide-narrow'
            aria-label='Keyboard shortcuts'
            title='Keyboard shortcuts (?)'
            onClick={onShowShortcuts}>
            <Icon name='keyboard' />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
