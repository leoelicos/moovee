import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Search from 'antd/es/input/Search'
import cleanQuery from '../../utils/cleanQuery'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { MovieContext, MovieDispatchContext } from '../../context'

export default function SearchBar() {
  const navigate = useNavigate()
  const dispatch = useContext(MovieDispatchContext)

  const { searchText } = useContext(MovieContext)

  function handleSubmit(query) {
    const text = cleanQuery(query)
    const encoded = encodeURIComponent(text)
    const nextPage = `/results?q=${encoded}`
    if (encoded.length > 0) navigate(nextPage)
    dispatch({ type: 'setSearchText', action: { text } })
  }

  function handleChange(event) {
    const text = event.target.value
    dispatch({ type: 'setSearchText', action: { text } })
  }

  return (
    <Search
      value={searchText}
      // loading={omdbLoading}
      allowClear={true}
      className='movie-search'
      placeholder={'Search for a movie'}
      enterButton={<FontAwesomeIcon icon={faSearch} />}
      onSearch={handleSubmit}
      onChange={handleChange}
    />
  )
}
