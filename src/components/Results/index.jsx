import { useEffect } from 'react'

import Result from './Result/index.jsx'
import ResultsLoadingSpinner from './ResultsLoadingSpinner.jsx'
import NoMovies from './NoMovies.jsx'
import { useSearchParams } from 'react-router-dom'
import useOMDBBySearch from '../../hooks/useOMDBBySearch.js'
import './style/results.css'
export default function Results() {
  const {
    loading: loadingBySearch,
    data: dataBySearch,
    search: searchBySearch //
  } = useOMDBBySearch()

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    if (!query) return
    searchBySearch(query)
  }, [searchBySearch, query])

  if (loadingBySearch) return <ResultsLoadingSpinner />
  if (!dataBySearch) return <h1>OMDB Error</h1>
  if (!dataBySearch.length) return <NoMovies />
  return (
    <div className='results'>
      {dataBySearch.map((movie, i) => (
        <Result
          key={i}
          idx={i}
          {...movie}
        />
      ))}
    </div>
  )
}
