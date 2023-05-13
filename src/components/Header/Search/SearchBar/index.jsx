import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Search from 'antd/es/input/Search'

export default function SearchBar({ handleSubmit, searchText, setSearchText }) {
  return (
    <Search
      value={searchText}
      // loading={omdbLoading}
      allowClear={true}
      className='movie-search'
      placeholder={'Any movie name…'}
      enterButton={<FontAwesomeIcon icon={faSearch} />}
      onSearch={handleSubmit}
      onChange={(e) => setSearchText(e.target.value)}
    />
  )
}
