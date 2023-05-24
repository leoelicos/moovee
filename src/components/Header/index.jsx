import { useContext, useEffect } from 'react'

import SearchBar from './SearchBar.jsx'
import SearchHistory from './SearchHistory.jsx'
import MooveeLogo from './MooveeLogo.jsx'
import { MovieContext, MovieDispatchContext } from '../../context/index.jsx'

import './style/header.css'
export default function Header() {
  const { query } = useContext(MovieContext)
  const dispatch = useContext(MovieDispatchContext)

  useEffect(() => {
    const text = decodeURIComponent(query)
    dispatch({ type: 'setSearchText', action: { text } })
  }, [query])

  return (
    <header>
      <MooveeLogo />
      <SearchBar />

      <SearchHistory />
    </header>
  )
}
