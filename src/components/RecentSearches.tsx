import { Link } from 'react-router'
import { useRecent } from '../hooks/useRecent'
import { searchHref } from '../lib/query'
import { Icon } from './Icon'

export function RecentSearches() {
  const { recent, remove, clear } = useRecent()
  if (recent.length === 0) return null
  return (
    <section className='section' aria-labelledby='recent-title'>
      <div className='section__header'>
        <h2 id='recent-title' className='section__title'>
          <Icon name='clock' /> Recent searches
        </h2>
        <button type='button' className='link-button' onClick={clear}>
          Clear all
        </button>
      </div>
      <ul className='chips'>
        {recent.map((query) => (
          <li key={query} className='chip chip--removable'>
            <Link to={searchHref({ q: query })} viewTransition>
              {query}
            </Link>
            <button type='button' aria-label={`Remove ${query} from recent searches`} onClick={() => remove(query)}>
              <Icon name='close' />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
