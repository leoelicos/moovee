import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Search from 'antd/es/input/Search'
import cleanQuery from '../../utils/cleanQuery'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { MovieContext, MovieDispatchContext } from '../../context'

export default function SearchBar() {
  const navigate = useNavigate()
  const dispatch = useContext(MovieDispatchContext)

  const { searchText } = useContext(MovieContext)

  function updateSearchText(text) {
    dispatch({ type: 'setSearchText', action: { text } })
  }

  function next(query) {
    navigate(`/results?q=${query}`)
  }

  function encode(query) {
    return encodeURIComponent(query)
  }

  function handleSubmit(query) {
    query = cleanQuery(query)
    if (query.length > 0) {
      const encoded = encode(query)
      next(encoded)
      updateSearchText(query)
    }
  }

  function handleChange(event) {
    const text = event.target.value
    if (text.length > 0) updateSearchText(text)
  }

  return (
    <Search
      value={searchText}
      // loading={omdbLoading}

      className='movie-search'
      placeholder={'Search for a movie'}
      enterButton={<FontAwesomeIcon icon={faSearch} />}
      onSearch={handleSubmit}
      onChange={handleChange}
    />
  )
}
