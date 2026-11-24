import { Link } from 'react-router'
import { Icon } from './Icon'
import { SearchBox } from './SearchBox'
import { ThemeToggle } from './ThemeToggle'

export function Header({ onShowShortcuts }: { onShowShortcuts: () => void }) {
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
