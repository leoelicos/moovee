import { useEffect } from 'react'

import Result from './Result/index.jsx'
import ResultsLoadingSpinner from './ResultsLoadingSpinner.jsx'
import ResultsEmpty from './ResultsEmpty.jsx'
import { useSearchParams } from 'react-router-dom'
import useOMDB from '../../hooks/useOMDB.js'

export default function Results() {
  const { omdbLoading, omdbMovies, searchOMDB } = useOMDB()

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    if (!query) return
    searchOMDB(query)
  }, [searchOMDB, query])

  if (omdbLoading) return <ResultsLoadingSpinner />
  if (!omdbMovies) return <h1>OMDB Error</h1>
  if (!omdbMovies.length) return <ResultsEmpty />

  return (
    <div className='results'>
      {omdbMovies.map((movie, i) => (
        <Result
          key={i}
          idx={i}
          {...movie}
        />
      ))}
    </div>
  )
}
