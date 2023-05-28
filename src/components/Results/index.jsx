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
    //TODO put to local storage
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
            .sort((a, b) => (+b.year >= +a.year ? 1 : -1))
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
