import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { RouteErrorPage } from './pages/ErrorPages'
import { keys } from './lib/env'
import { expectNoAxeViolations } from './test/axe'
import { mockAppApis } from './test/apiMocks'
import { renderApp } from './test/render'

const search = () => screen.getByRole('searchbox', { name: 'Search movies and series' })

describe('home (discover)', () => {
  it('shows the #1 popular title as a hero and the rest as a rail', async () => {
    mockAppApis()
    const { container } = renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Dune: Part Two' })).toBeInTheDocument()
    const rail = screen.getByRole('region', { name: 'Popular right now' })
    expect(within(rail).getByRole('link', { name: /Wicked/ })).toHaveAttribute('href', '/search?q=Wicked')
    expect(within(rail).getByTestId('poster-fallback')).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })

  it('falls back to quick picks when TMDB fails', async () => {
    mockAppApis({ tmdbFail: true })
    renderApp('/')
    expect(await screen.findByRole('heading', { name: 'Try one of these' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Find any trailer, fast.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dune' })).toHaveAttribute('href', '/search?q=Dune')
  })

  it('lists, removes and clears recent searches', async () => {
    mockAppApis()
    localStorage.setItem('moovee:recent', JSON.stringify(['heat', 'up']))
    const { user } = renderApp('/')
    const recent = screen.getByRole('region', { name: 'Recent searches' })
    expect(within(recent).getByRole('link', { name: 'heat' })).toHaveAttribute('href', '/search?q=heat')
    await user.click(screen.getByRole('button', { name: 'Remove heat from recent searches' }))
    expect(within(recent).queryByRole('link', { name: 'heat' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(screen.queryByRole('region', { name: 'Recent searches' })).not.toBeInTheDocument()
  })
})

describe('search', () => {
  it('searches as you type, syncs the URL and shows a count', async () => {
    const calls = mockAppApis()
    const { user, location } = renderApp('/')
    await user.type(search(), 'alien')
    expect(await screen.findByRole('heading', { level: 1, name: 'Results for “alien”' })).toBeInTheDocument()
    expect(location().pathname).toBe('/search')
    expect(location().search).toBe('?q=alien')
    expect(await screen.findByText('Showing 10 of 25 results')).toBeInTheDocument()
    // Debounced: one search for the settled text, not one per keystroke.
    expect(calls.filter((u) => u.host === 'www.omdbapi.com')).toHaveLength(1)
  })

  it('Enter searches at once and saves the query to recent searches', async () => {
    mockAppApis()
    const { user, location } = renderApp('/')
    await user.type(search(), 'heat{Enter}')
    expect(location().search).toBe('?q=heat')
    expect(JSON.parse(localStorage.getItem('moovee:recent') ?? '[]')).toEqual(['heat'])
    await user.clear(search())
    await user.keyboard('{Enter}')
    await waitFor(() => expect(location().pathname).toBe('/'))
  })

  it('shows skeletons, then results, and loads more pages', async () => {
    mockAppApis({ total: 25 })
    const { user } = renderApp('/search?q=alien')
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /^alien 1,/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Load more' }))
    expect(await screen.findByText('Showing 20 of 25 results')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Load more' }))
    expect(await screen.findByText('Showing 25 of 25 results')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })

  it('applies type, year and sort filters through the URL', async () => {
    const calls = mockAppApis()
    const { user, location } = renderApp('/search?q=alien')
    await screen.findByText('Showing 10 of 25 results')
    await user.click(screen.getByRole('radio', { name: 'Series' }))
    await waitFor(() => expect(location().search).toBe('?q=alien&type=series'))
    await user.type(screen.getByRole('textbox', { name: 'Year' }), '19x79')
    await waitFor(() => expect(location().search).toBe('?q=alien&type=series&y=1979'))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort' }), 'title')
    await waitFor(() => expect(location().search).toBe('?q=alien&type=series&y=1979&sort=title'))
    await screen.findByText('Showing 10 of 25 results')
    const last = calls.filter((u) => u.host === 'www.omdbapi.com').at(-1)
    expect(last?.searchParams.get('type')).toBe('series')
    expect(last?.searchParams.get('y')).toBe('1979')
    const titles = screen.getAllByRole('button', { name: /^alien \d+/ }).map((b) => b.textContent)
    expect(titles[0]).toMatch(/^alien 1,/)
    expect(titles[1]).toMatch(/^alien 10,/)
    await user.clear(screen.getByRole('textbox', { name: 'Year' }))
    await waitFor(() => expect(location().search).toBe('?q=alien&type=series&sort=title'))
  })

  it('shows an empty state with a way to clear filters', async () => {
    mockAppApis()
    const { user, location } = renderApp('/search?q=zzz&type=movie')
    expect(await screen.findByRole('heading', { name: 'No matches' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: '' })).toHaveTextContent('No results')
    await user.click(screen.getByRole('link', { name: 'Clear filters' }))
    expect(location().search).toBe('?q=zzz')
    expect(await screen.findByText(/Check the spelling/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('shows an error with retry', async () => {
    mockAppApis({ omdbFail: true })
    const { user, container } = renderApp('/search?q=alien')
    expect(await screen.findByRole('alert')).toHaveTextContent('The service answered with an error (500).')
    await expectNoAxeViolations(container)
    mockAppApis()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Showing 10 of 25 results')).toBeInTheDocument()
  })

  it('explains a missing OMDb key without offering a pointless retry', async () => {
    mockAppApis()
    keys.omdb = null
    renderApp('/search?q=alien')
    expect(await screen.findByRole('heading', { name: 'API key needed' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })

  it('accepts old /results links', async () => {
    mockAppApis()
    renderApp('/results?q=alien')
    expect(await screen.findByRole('heading', { level: 1, name: 'Results for “alien”' })).toBeInTheDocument()
  })

  it('has no axe violations with results', async () => {
    mockAppApis()
    const { container } = renderApp('/search?q=alien')
    await screen.findByText('Showing 10 of 25 results')
    await expectNoAxeViolations(container)
  })
})

describe('keyboard', () => {
  it('/ focuses search, arrows move through results, Esc clears', async () => {
    mockAppApis()
    const { user } = renderApp('/search?q=alien')
    await screen.findByText('Showing 10 of 25 results')
    await user.click(document.body)
    await user.keyboard('/')
    expect(search()).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    const cards = screen.getAllByRole('button', { name: /^alien \d+/ })
    expect(cards[0]).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(cards[1]).toHaveFocus()
    await user.keyboard('{End}')
    expect(cards.at(-1)).toHaveFocus()
    await user.keyboard('{Home}')
    expect(cards[0]).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(cards[0]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    // jsdom has no layout, so every card is in the "first row": Down goes to the end.
    expect(cards.at(-1)).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(search()).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(search()).toHaveValue('')
    await user.keyboard('{Escape}')
    expect(search()).not.toHaveFocus()
  })

  it('ignores other keys in the grid, modified shortcuts and ArrowDown with no results', async () => {
    mockAppApis({ tmdbFail: true })
    const { user } = renderApp('/')
    await user.click(search())
    await user.keyboard('{ArrowDown}')
    expect(search()).toHaveFocus()
    search().blur()
    await user.keyboard('{Control>}/{/Control}')
    expect(search()).not.toHaveFocus()
    fireEvent.keyDown(document.body, { key: 'x' })
    expect(search()).not.toHaveFocus()
  })

  it('? opens the shortcuts list, Esc closes it', async () => {
    mockAppApis()
    const { user } = renderApp('/')
    await user.keyboard('?')
    const dialog = await screen.findByRole('dialog', { name: 'Keyboard shortcuts' })
    expect(within(dialog).getByText('Focus search')).toBeInTheDocument()
    await expectNoAxeViolations(dialog)
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Keyboard shortcuts' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('detail and trailer', () => {
  it('opens details from a result, plays the trailer and closes back to the results', async () => {
    mockAppApis()
    const { user, location } = renderApp('/search?q=alien')
    const card = await screen.findByRole('button', { name: /^alien 1,/ })
    await user.click(card)
    expect(location().search).toBe('?q=alien&m=tt1000001')
    const dialog = await screen.findByRole('dialog', { name: 'Title tt1000001' })
    expect(within(dialog).getByText('1999 · R · 136 min')).toBeInTheDocument()
    expect(within(dialog).getByRole('list', { name: 'Ratings' })).toHaveTextContent('Rotten Tomatoes')
    expect(within(dialog).getByText('Won 4 Oscars. 42 wins & 51 nominations total')).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /View on IMDb/ })).toHaveAttribute(
      'href',
      'https://www.imdb.com/title/tt1000001/'
    )
    await expectNoAxeViolations(dialog)
    await user.click(within(dialog).getByRole('button', { name: 'Play trailer' }))
    const frame = await within(dialog).findByTitle('Title tt1000001 trailer')
    expect(frame).toHaveAttribute('src', expect.stringContaining('youtube-nocookie.com/embed/vid123'))
    expect(JSON.parse(localStorage.getItem('moovee:recent') ?? '[]')).toEqual(['alien'])
    await user.click(within(dialog).getByRole('button', { name: 'Close details' }))
    await waitFor(() => expect(location().search).toBe('?q=alien'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens straight from a shared link and closes with Esc or a backdrop click', async () => {
    mockAppApis()
    const { location, user } = renderApp('/search?q=alien&m=tt1000002')
    const dialog = await screen.findByRole('dialog', { name: 'Title tt1000002' })
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    await waitFor(() => expect(location().search).toBe('?q=alien'))
    await user.click(await screen.findByRole('button', { name: /^alien 2,/ }))
    const again = await screen.findByRole('dialog')
    fireEvent.click(within(again).getByRole('article'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(again)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('opens from the home page link too', async () => {
    mockAppApis()
    const { location } = renderApp('/?m=tt1000003')
    await screen.findByRole('dialog', { name: 'Title tt1000003' })
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    await waitFor(() => expect(location().search).toBe(''))
  })

  it('shows a fallback when no trailer is found or YouTube fails', async () => {
    mockAppApis({ trailer: 'none' })
    const { user } = renderApp('/search?q=alien&m=tt1000004')
    const dialog = await screen.findByRole('dialog')
    await user.click(await within(dialog).findByRole('button', { name: 'Play trailer' }))
    expect(await within(dialog).findByText('No trailer found on YouTube.')).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /Search YouTube/ })).toHaveAttribute(
      'href',
      expect.stringContaining('youtube.com/results')
    )
  })

  it('reports YouTube errors and a missing key', async () => {
    mockAppApis({ trailer: 'error' })
    const { user, unmount } = renderApp('/search?q=alien&m=tt1000005')
    await user.click(await screen.findByRole('button', { name: 'Play trailer' }))
    expect(await screen.findByText('The trailer could not be loaded.')).toBeInTheDocument()
    unmount()
    keys.youtube = null
    const second = renderApp('/search?q=alien&m=tt1000006')
    await second.user.click(await screen.findByRole('button', { name: 'Play trailer' }))
    expect(await screen.findByText(/Trailers need a YouTube API key/)).toBeInTheDocument()
  })

  it('shows a loading state, then an error with retry for details', async () => {
    mockAppApis({ omdbFail: true })
    const { user } = renderApp('/?m=tt1000007')
    expect(screen.getByRole('dialog', { name: 'Loading title details' })).toBeInTheDocument()
    expect(await screen.findByRole('dialog', { name: 'Title details' })).toBeInTheDocument()
    mockAppApis()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('dialog', { name: 'Title tt1000007' })).toBeInTheDocument()
  })
})

describe('theme and pages', () => {
  it('cycles the theme', async () => {
    mockAppApis()
    const { user } = renderApp('/')
    await user.click(screen.getByRole('button', { name: 'Theme: System. Switch to Light' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    await user.click(screen.getByRole('button', { name: 'Theme: Light. Switch to Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('shows a 404 page', async () => {
    mockAppApis()
    renderApp('/nope')
    expect(screen.getByRole('heading', { name: 'This page wandered off' })).toBeInTheDocument()
  })

  it('shows the error page when a route crashes', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const Boom = () => {
      throw new Error('Kaboom')
    }
    const router = createMemoryRouter([{ path: '/', element: <Boom />, errorElement: <RouteErrorPage /> }])
    render(<RouterProvider router={router} />)
    expect(screen.getByRole('heading', { name: 'Holy cow, something broke' })).toBeInTheDocument()
    expect(screen.getByText('Kaboom')).toBeInTheDocument()
  })

  it('describes route responses on the error page', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const router = createMemoryRouter([
      {
        path: '/',
        loader: () => {
          throw new Response('', { status: 418, statusText: 'Teapot' })
        },
        element: null,
        errorElement: <RouteErrorPage />
      },
      {
        path: '/odd',
        loader: () => {
          throw 'odd'
        },
        element: null,
        errorElement: <RouteErrorPage />
      }
    ])
    render(<RouterProvider router={router} />)
    expect(await screen.findByText('418 Teapot')).toBeInTheDocument()
    await act(() => router.navigate('/odd'))
    expect(await screen.findByText('Unknown error')).toBeInTheDocument()
  })
})
