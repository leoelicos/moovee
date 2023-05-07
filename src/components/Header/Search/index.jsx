import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// import useOMDB from '../../../hooks/useOMDB.js'
import SearchBar from './SearchBar/index.jsx'
import SearchHistory from './SearchHistory/index.jsx'
import cleanQuery from './cleanQuery.js'

export default function Search() {
  const navigate = useNavigate()
  function goToResults(query) {
    navigate(`/results?q=${cleanQuery(query)}`)
  }

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  console.log({ query })

  useEffect(() => {
    console.log('searchOMDB')
  }, [query])

  return (
    <div className='header-elements'>
      <SearchBar
        // loading={omdbLoading}
        handleSubmit={goToResults}
      />
      <SearchHistory handleSubmit={goToResults} />
    </div>
  )
}
