import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import SearchBar from './SearchBar.jsx'
import SearchHistory from './SearchHistory.jsx'
import MooveeLogo from './MooveeLogo.jsx'
import { MovieContext, MovieDispatchContext } from '../../context/index.jsx'

import './style/header.css'
export default function Header() {
  const navigate = useNavigate()
  const { query } = useContext(MovieContext)
  const dispatch = useContext(MovieDispatchContext)

  useEffect(() => {
    const text = decodeURIComponent(query)
    dispatch({ type: 'setSearchText', action: { text } })
  }, [query])

  const handleClickLogo = () => {
    navigate(`/`)
  }

  return (
    <header>
      <MooveeLogo handleClickLogo={handleClickLogo} />
      <SearchBar />

      <SearchHistory />
    </header>
  )
}
