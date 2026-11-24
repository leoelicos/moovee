import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Filters } from '../components/Filters'
import { RecentSearches } from '../components/RecentSearches'
import { ResultsGrid } from '../components/ResultsGrid'
import { ErrorMessage, Message, SkeletonGrid } from '../components/States'
import { useMovieDialog } from '../hooks/useMovieDialog'
import { useSearchResults } from '../hooks/useSearchResults'
import { MIN_QUERY, parseSearch, searchHref, sortMovies, type SearchState } from '../lib/query'
import { DiscoverPage } from './DiscoverPage'

export function SearchPage() {
  const [params] = useSearchParams()
  const state = parseSearch(params)
  if (state.q.length < MIN_QUERY) return <DiscoverPage />
  return <Results state={state} />
}

function Results({ state }: { state: SearchState }) {
  const navigate = useNavigate()
  const dialog = useMovieDialog()
  const input = useMemo(
    () => ({ query: state.q, type: state.type === 'all' ? undefined : state.type, year: state.year }),
    [state.q, state.type, state.year]
  )
  const results = useSearchResults(input)
  const items = useMemo(() => sortMovies(results.items, state.sort), [results.items, state.sort])
  const filtered = state.type !== 'all' || state.year !== ''

  const update = (patch: Partial<SearchState>) =>
    navigate(searchHref({ ...state, ...patch, m: null }), { replace: true, viewTransition: true })

  return (
    <div className='page'>
      <div className='results-header'>
        <h1 className='results-header__title'>Results for “{state.q}”</h1>
        <Filters state={state} onChange={update} />
      </div>
      <p className='results-count' role='status'>
        {results.status === 'success'
          ? results.total === 0
            ? 'No results'
            : `Showing ${items.length} of ${results.total.toLocaleString()} result${results.total === 1 ? '' : 's'}`
          : ''}
      </p>
      {results.status === 'loading' || results.status === 'idle' ? <SkeletonGrid /> : null}
      {results.status === 'error' && results.error ? (
        <ErrorMessage error={results.error} onRetry={results.retry} />
      ) : null}
      {results.status === 'success' && items.length === 0 ? (
        <Message
          title='No matches'
          action={
            filtered ? (
              <Link className='button button--primary' to={searchHref({ q: state.q })} replace>
                Clear filters
              </Link>
            ) : undefined
          }>
          <p>
            Nothing found for “{state.q}”{filtered ? ' with these filters' : ''}. Check the spelling or try a shorter
            title.
          </p>
        </Message>
      ) : null}
      {items.length > 0 ? <ResultsGrid items={items} onOpen={(movie) => dialog.open(movie.id)} /> : null}
      {results.status === 'success' && results.error && items.length > 0 ? (
        <div className='load-more' role='alert'>
          <p>Couldn’t load more results. {results.error.message}</p>
          <button type='button' className='button' onClick={results.retry}>
            Try again
          </button>
        </div>
      ) : null}
      {results.hasMore || results.loadingMore ? (
        <div className='load-more'>
          <button
            type='button'
            className='button button--primary'
            onClick={() => {
              if (!results.loadingMore) results.loadMore()
            }}
            aria-disabled={results.loadingMore}
            aria-busy={results.loadingMore}>
            {results.loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      ) : null}
      {results.status === 'success' && items.length === 0 ? <RecentSearches /> : null}
    </div>
  )
}
