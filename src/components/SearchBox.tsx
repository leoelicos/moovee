import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { notifyRecent } from '../hooks/useRecent'
import { focusFirstCard, SEARCH_INPUT_ID } from '../lib/dom'
import { addRecent } from '../lib/history'
import { cleanQuery, MIN_QUERY, parseSearch, searchHref } from '../lib/query'
import { Icon } from './Icon'

export const DEBOUNCE_MS = 350

/** Instant search: results follow the text after a short pause; Enter searches straight away. */
export function SearchBox() {
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const state = parseSearch(params)
  const urlQuery = location.pathname === '/' ? '' : state.q
  const [text, setText] = useState(urlQuery)
  const lastUrlQuery = useRef(urlQuery)
  const timer = useRef<number | undefined>(undefined)

  // Back/forward or a link changed the URL: show its query in the box.
  useEffect(() => {
    if (urlQuery !== lastUrlQuery.current) {
      lastUrlQuery.current = urlQuery
      setText((current) => (cleanQuery(current) === urlQuery ? current : urlQuery))
    }
  }, [urlQuery])

  const go = (query: string, replace: boolean) => {
    lastUrlQuery.current = query
    navigate(query ? searchHref({ ...state, q: query, m: null }) : '/', { replace, viewTransition: !replace })
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  /** Results follow the text once typing pauses. */
  const change = (next: string) => {
    setText(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const query = cleanQuery(next)
      if (query === lastUrlQuery.current) return
      if (query.length >= MIN_QUERY) go(query, location.pathname !== '/')
      else if (query === '' && location.pathname !== '/') go('', true)
    }, DEBOUNCE_MS)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    window.clearTimeout(timer.current)
    const query = cleanQuery(text)
    if (query.length === 0) {
      if (location.pathname !== '/') go('', false)
      return
    }
    addRecent(query)
    notifyRecent()
    if (query !== lastUrlQuery.current) go(query, false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      if (focusFirstCard()) event.preventDefault()
    } else if (event.key === 'Escape') {
      if (text) {
        event.preventDefault()
        change('')
      } else {
        event.currentTarget.blur()
      }
    }
  }

  return (
    <form role='search' className='search' onSubmit={submit} aria-label='Movies and series'>
      <label htmlFor={SEARCH_INPUT_ID} className='visually-hidden'>
        Search movies and series
      </label>
      <Icon name='search' className='search__icon' />
      <input
        id={SEARCH_INPUT_ID}
        className='search__input'
        type='search'
        inputMode='search'
        enterKeyHint='search'
        autoComplete='off'
        spellCheck={false}
        placeholder='Search titles'
        aria-describedby='search-hint'
        value={text}
        onChange={(event) => change(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <kbd className='search__kbd' aria-hidden='true'>
        /
      </kbd>
      <span id='search-hint' className='visually-hidden'>
        Results update as you type. Press Down arrow to move to the results.
      </span>
    </form>
  )
}
