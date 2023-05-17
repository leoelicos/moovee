import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import SearchHistory from './SearchHistory.jsx'
import MooveeLogo from './MooveeLogo.jsx'
import cleanQuery from '../../utils/cleanQuery.js'

export default function Header({ initialQuery }) {
  const [searchText, setSearchText] = useState('')

  const navigate = useNavigate()

  function handleSubmit(str) {
    str = cleanQuery(str)
    if (str.length > 0) navigate(`/results?q=${str}`)
  }

  useEffect(() => {
    setSearchText(initialQuery)
  }, [initialQuery])

  return (
    <header>
      <MooveeLogo />
      <SearchBar
        // loading={omdbLoading}
        handleSubmit={handleSubmit}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <SearchHistory handleSubmit={handleSubmit} />
    </header>
  )
}
