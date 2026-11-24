import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { useRecent } from '../hooks/useRecent'
import { useWatchlist } from '../hooks/useWatchlist'
import { addRecent } from '../lib/history'
import { cleanQuery, MIN_QUERY, searchHref } from '../lib/query'
import { applyTheme, getTheme, nextTheme } from '../lib/theme'
import { Dialog } from './Dialog'
import { Icon, type IconName } from './Icon'

interface Command {
  id: string
  label: string
  hint: string
  icon: IconName
  run: () => void
}

const matches = (text: string, query: string) => text.toLowerCase().includes(query.toLowerCase())

/** Ctrl/⌘+K: one box to search, reopen recent searches and saved titles, or run an action. */
export function CommandPalette({ onClose, onShortcuts }: { onClose: () => void; onShortcuts: () => void }) {
  const id = useId()
  const navigate = useNavigate()
  const { recent } = useRecent()
  const watchlist = useWatchlist()
  const [text, setText] = useState('')
  const [active, setActive] = useState(0)
  const query = cleanQuery(text)

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => navigate(to, { viewTransition: true })
    const list: Command[] = []
    if (query.length >= MIN_QUERY) {
      list.push({
        id: 'search',
        label: `Search for “${query}”`,
        hint: 'Search',
        icon: 'search',
        run: () => {
          addRecent(query)
          navigate(searchHref({ q: query }), { viewTransition: true })
        }
      })
    }
    for (const item of watchlist.filter((m) => !query || matches(m.title, query)).slice(0, 5)) {
      list.push({
        id: `saved-${item.id}`,
        label: `${item.title} (${item.year})`,
        hint: 'Watchlist',
        icon: 'bookmarkFilled',
        run: go(`/watchlist?m=${item.id}`)
      })
    }
    for (const q of recent.filter((r) => !query || matches(r, query)).slice(0, 5)) {
      list.push({ id: `recent-${q}`, label: q, hint: 'Recent', icon: 'clock', run: go(searchHref({ q })) })
    }
    const actions: Command[] = [
      { id: 'home', label: 'Go to home', hint: 'Page', icon: 'play', run: go('/') },
      { id: 'watchlist', label: 'Open watchlist', hint: 'Page', icon: 'bookmark', run: go('/watchlist') },
      {
        id: 'theme',
        label: `Switch theme (now ${getTheme()})`,
        hint: 'Action',
        icon: 'sun',
        run: () => applyTheme(nextTheme(getTheme()))
      },
      { id: 'shortcuts', label: 'Keyboard shortcuts', hint: 'Help', icon: 'keyboard', run: onShortcuts }
    ]
    return [...list, ...actions.filter((a) => !query || matches(a.label, query))]
  }, [query, recent, watchlist, navigate, onShortcuts])

  const current = Math.min(active, Math.max(0, commands.length - 1))

  const run = (command: Command | undefined) => {
    if (!command) return
    onClose()
    command.run()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current + step + commands.length) % Math.max(1, commands.length))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      run(commands[current])
    }
  }

  return (
    <Dialog labelledBy={`${id}-title`} onClose={onClose} className='dialog--small dialog--palette'>
      <h2 id={`${id}-title`} className='visually-hidden'>
        Command palette
      </h2>
      <div className='palette__field'>
        <Icon name='search' className='search__icon' />
        <input
          className='palette__input'
          role='combobox'
          aria-expanded='true'
          aria-controls={`${id}-list`}
          aria-activedescendant={commands[current] ? `${id}-${commands[current].id}` : undefined}
          aria-autocomplete='list'
          aria-label='Type a title or a command'
          placeholder='Type a title or a command'
          autoComplete='off'
          spellCheck={false}
          // The palette exists to be typed into, so Dialog moves focus straight to the box.
          data-autofocus
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div id={`${id}-list`} role='listbox' aria-label='Commands' className='palette__list'>
        {commands.map((command, index) => (
          // Options are chosen with the arrow keys and Enter in the combobox above, or by pointer.
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            key={command.id}
            id={`${id}-${command.id}`}
            role='option'
            tabIndex={-1}
            aria-selected={index === current}
            className='palette__option'
            onMouseMove={() => setActive(index)}
            onClick={() => run(command)}>
            <Icon name={command.icon} />
            <span className='palette__label'>{command.label}</span>
            <span className='palette__hint'>{command.hint}</span>
          </div>
        ))}
      </div>
      <p className='palette__footer' aria-hidden='true'>
        <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to choose · <kbd>Esc</kbd> to close
      </p>
    </Dialog>
  )
}
