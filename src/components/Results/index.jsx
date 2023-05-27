import { useEffect } from 'react'

import Result from './Result/index.jsx'
import ResultsLoadingSpinner from './ResultsLoadingSpinner.jsx'
import NoMovies from './NoMovies.jsx'
import { useSearchParams } from 'react-router-dom'
import useOMDBBySearch from '../../hooks/useOMDBBySearch.js'
import './style/results.css'
export default function Results() {
  const { loading, error, data, search } = useOMDBBySearch()

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    if (!query) return
    search(query)
  }, [search, query])

  if (loading) return <ResultsLoadingSpinner />
  if (!data || data.length === 0) return <NoMovies />
  return (
    <>
      {error && <h1>OMDB Error</h1>}
      <div className='results'>
        {data.map((movie, i) => (
          <Result
            key={i}
            idx={i}
            {...movie}
          />
        ))}
      </div>
    </>
  )
}
