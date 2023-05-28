import { useEffect } from 'react'

import Result from './Result/index.jsx'
import ResultsLoadingSpinner from './ResultsLoadingSpinner.jsx'
import NoMovies from './NoMovies.jsx'
import { useSearchParams } from 'react-router-dom'
import useOMDBBySearch from '../../hooks/useOMDBBySearch.js'
import './style/results.css'
import { omdbSerialize } from '../../utils/omdbSerialize.js'
export default function Results() {
  const { loading, error, data, search } = useOMDBBySearch()

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    if (!query) return

    const putToLocalStorage = () => {
      const store = localStorage.getItem('movies')
      let parsed = [query]
      if (store) parsed = parsed.concat(...JSON.parse(store).filter((movie) => movie !== query))
      if (parsed.length > 5) parsed.pop()
      localStorage.setItem('movies', JSON.stringify(parsed))
    }
    putToLocalStorage()

    const serialised = omdbSerialize(query)
    search(serialised)
  }, [search, query])

  if (loading) return <ResultsLoadingSpinner />

  return (
    <>
      {error && <h1 className='error'>OMDB Error</h1>}
      <div className='results'>
        {!data || data.length === 0 ? (
          <NoMovies />
        ) : (
          data
            .sort((a, b) => {
              if (b.poster && !a.poster) return 1
              else if (a.poster && !b.poster) return -1
              else if (+b.year >= +a.year) return 1
              else return -1
            })
            .map((movie, i) => (
              <Result
                key={i}
                idx={i}
                {...movie}
              />
            ))
        )}
      </div>
    </>
  )
}
