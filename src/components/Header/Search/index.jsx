import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import useOMDB from '../../../hooks/useOMDB.js'
import SearchBar from './SearchBar/index.jsx'
import SearchHistory from './SearchHistory/index.jsx'
import cleanQuery from './cleanQuery.js'

export default function Search({ query: initialQuery }) {
  const [searchText, setSearchText] = useState('')

  const navigate = useNavigate()
  function handleSubmit(query) {
    /* change searchbar state */
    navigate(`/results?q=${cleanQuery(query)}`)
  }

  useEffect(() => {
    setSearchText(initialQuery)
  }, [initialQuery])

  return (
    <div className='header-elements'>
      <SearchBar
        // loading={omdbLoading}
        handleSubmit={handleSubmit}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <SearchHistory handleSubmit={handleSubmit} />
    </div>
  )
}
